import axios from 'axios';
import { navigateToLogin } from '../utils/navigation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/register');
      
      if (!isAuthPage) {
        // Clear token and trigger logout
        localStorage.removeItem('token');
        
        // Call global logout handler if available (from AuthContext)
        if (window.handleAuthLogout) {
          window.handleAuthLogout();
        }
        
        // Navigate to login
        navigateToLogin();
      }
    }
    return Promise.reject(error);
  }
);

export default api;

