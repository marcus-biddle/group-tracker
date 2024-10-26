// src/api/axiosInstance.ts
import axios from 'axios';
import { getToken, isTokenExpired } from '../helpers/authHelper.ts';

// Create an Axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: 'https://group-tracker.onrender.com/api',  // Base API URL
  timeout: 5000, // Timeout for requests (in milliseconds)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adding JWT token to every request (if available)
axiosInstance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token && !isTokenExpired()) {
        config.headers['Authorization'] = `Bearer ${token}`;  // Set the token in headers
      } else {
        // Optionally handle token expiration here, like redirecting to login
        console.log('Token expired or possibly signing in.');
        // Redirect to login page or notify the user
      }
      return config;
    },
    (error) => {
        if (error.response?.status === 401) {
          // Token is expired or invalid
          console.log('Unauthorized - Token might be expired');
          // Optionally remove token and redirect to login page
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
  );

export default axiosInstance;
