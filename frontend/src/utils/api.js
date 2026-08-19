import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Fail-safe API base URL resolution
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  // In development, relative '/api/v1' uses Vite proxy to avoid cross-origin preflight issues
  return '/api/v1';
};

// Create Axios Instance
export const api = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true, // Send HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh Token Queue Handler
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor with Automatic Retry on Network Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle Network Errors (Fallback to direct backend URL if proxy fails)
    if (!error.response && !originalRequest._networkRetry) {
      originalRequest._networkRetry = true;
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        originalRequest.baseURL = 'http://localhost:5000/api/v1';
        return api(originalRequest);
      }
    }

    // If 401 Unauthorized and not already retrying token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${getBaseUrl()}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;
        useAuthStore.getState().setAccessToken(newToken);
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
