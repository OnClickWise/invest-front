import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// URL base do seu Backend .NET conforme a documentação
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Adiciona o Token JWT em toda requisição automaticamente
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (user?.tenantId && config.headers && !config.headers['X-Tenant-Id']) {
      config.headers['X-Tenant-Id'] = user.tenantId;
    }
  }
  return config;
}, (error: AxiosError) => {
  return Promise.reject(error);
});

// Interceptor: Trata erros de sessão (401 - Não autorizado)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
      // Se o token expirou ou é inválido, desloga o usuário
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;