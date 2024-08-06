// src/axios.js
import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: 'https://i11c104.p.ssafy.io/', // 백엔드 URL 설정
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 응답 인터셉터 설정
instance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const originalRequest = error.config;

  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // 엑세스 토큰 만료시 리프레시 토큰으로 재발급 요청
    const refreshToken = Cookies.get('refreshToken');
    if (refreshToken) {
      try {
        const response = await instance.post('/api/v1/auth/refresh-token', { refreshToken });
        if (response.data.accessToken) {
          Cookies.set('accessToken', response.data.accessToken, { path: '/' });
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          return instance(originalRequest);
        }
      } catch (err) {
        console.error('Refresh token error', err);
        // Refresh token이 유효하지 않으면 로그아웃 처리
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        window.location.href = '/login';
      }
    }
  }

  return Promise.reject(error);
});

export const checkTokenValidity = async () => {
  try {
    const response = await instance.get('/api/v1/auth/check-token');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default instance;
