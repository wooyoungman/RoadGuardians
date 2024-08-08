// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://i11c104.p.ssafy.io/api/v1', // API 버전 포함
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 설정
instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('accessToken');
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

  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    // 엑세스 토큰 만료시 리프레시 토큰으로 재발급 요청
    const refreshToken = sessionStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await instance.post('/auth/refresh-token', { refreshToken });
        // console.log(response.data.data.accessToken)
        if (response.data.data.accessToken) {
          sessionStorage.setItem('accessToken', response.data.data.accessToken);
          instance.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.accessToken}`;
          return instance(originalRequest);
        }
      } catch (err) {
        console.error('Refresh token error', err);
        // Refresh token이 유효하지 않으면 로그아웃 처리
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
  }

  return Promise.reject(error);
});

export const checkTokenValidity = async () => {
  try {
    const response = await instance.get('/auth/check-token');
    console.log(response)
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default instance;