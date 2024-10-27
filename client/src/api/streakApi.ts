import axiosInstance from "./axiosInstance";

export const retrieveStreak = async () => {
    try {
      const response = await axiosInstance.get('/streak/player');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve players.');
    }
  };

export const updateStreak = async (exerciseId: { exerciseId: number }) => {
    console.log('api file', exerciseId);
    try {
        const response = await axiosInstance.post('/exercises/streak/update', exerciseId);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error; // Re-throw the error for further handling if needed
    }
};