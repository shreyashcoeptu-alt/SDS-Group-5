import axios from 'axios';

/**
 * Shared Axios client instance.
 * Automatically attaches Authorization header if a token is present in localStorage.
 * Base URL defaults to VITE_API_URL or http://localhost:5000/api.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token when Student 1's auth is active
axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('the_lunchroom_token') ||
      localStorage.getItem('cafeteria_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error unwrapping
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default axiosClient;
