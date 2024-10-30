import axiosInstance from "./axiosInstance";

export const retrieveUsers = async () => {
    try {
      const response = await axiosInstance.get('/players');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve players.');
    }
  };