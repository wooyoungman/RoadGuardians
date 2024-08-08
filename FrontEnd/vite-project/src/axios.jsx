
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://i11c104.p.ssafy.io', // 백엔드 URL
  withCredentials: true, // 쿠키 전송 설정
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

async function refreshAccessToken() {
  try {
    const response = await api.post('/api/v1/auth/refresh-token');
    localStorage.setItem('accessToken', response.data.data.accessToken);
    return response.data.data.accessToken;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }
}

export async function checkTokenValidity() {
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  try {
    const response = await api.get('/api/v1/auth/check-token', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.result;
  } catch (error) {
    console.error('Token validation error', error);
    return false;
  }
}

export async function logout() {
  try {
    await api.post('/api/v1/auth/logout');
  } catch (error) {
    console.error('Failed to logout', error);
  }
}


export default api;
