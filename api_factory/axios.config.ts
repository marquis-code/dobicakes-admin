import axios, { type AxiosResponse } from "axios";

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin');
    localStorage.removeItem('admin_token');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
};

const $GATEWAY_ENDPOINT = 'https://dobicakes-backend.onrender.com';

export const GATEWAY_ENDPOINT = axios.create({
  baseURL: $GATEWAY_ENDPOINT,
});

GATEWAY_ENDPOINT.interceptors.request.use((config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

 GATEWAY_ENDPOINT.interceptors.response.use(
  (response: AxiosResponse) => response,
  (err: any) => {
    if (err.response?.status === 401) {
      redirectToLogin();
    }
    return Promise.reject(err);
  }
);
