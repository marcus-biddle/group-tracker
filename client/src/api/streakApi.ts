import axiosInstance from "./axiosInstance";

export const retrieveStreak = async () => {
    try {
      const response = await axiosInstance.get('/streak/player');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve players.');
    }
  };