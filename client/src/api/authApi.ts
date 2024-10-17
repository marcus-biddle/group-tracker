// src/api/authApi.ts
import axiosInstance from './axiosInstance';

// Interface for login and signup requests
interface AuthData {
  email: string;
  password: string;
}

// Login user
export const loginUser = async (data: AuthData) => {
  try {
    const response = await axiosInstance.post('/users/login', data);
    // Save JWT token to localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

// Register user
export const registerUser = async (data: AuthData) => {
  try {
    const response = await axiosInstance.post('/users/signup', data);
    // Save JWT token to localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token'); // Remove token from localStorage
};
