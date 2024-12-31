// src/utils/authHelper.ts
import { jwtDecode } from 'jwt-decode';
import supabase from '../api/supabase';

// Helper to decode the JWT
interface DecodedToken {
  exp: number; // The expiration time in seconds
}

export const getToken = (): string | null => {
  const token = localStorage.getItem('token');
  return token ? token : null;
};

export const getUserId = (): string | null => {
  const id = localStorage.getItem('user_id');
  return id ? id : null;
};

// Helper to check if token is expired
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true; // If no token, consider expired

  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds
    return decoded.exp < currentTime; // Check if token is expired
  } catch (error) {
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    return true; // If token can't be decoded, treat it as expired
  }
};

// Helper to check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !isTokenExpired(); // User is authenticated if token is not expired
};

export const getUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    return data.user; // Return the user object
  } catch (err) {
    console.error('Error fetching user:', err.message);
    return null; // Return null if there's an error
  }
};