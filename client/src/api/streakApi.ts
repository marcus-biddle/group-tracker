import axiosInstance from "./axiosInstance";

export const retrieveStreak = async () => {
    try {
      const response = await axiosInstance.get('/streak/player');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve players.');
    }
  };

export const updateStreak = async (exercise_id: { exercise_id: number }) => {
    console.log('api file', exercise_id);
    try {
        const response = await axiosInstance.post('/streak/update', exercise_id);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error updating streak:', error);
        throw error; // Re-throw the error for further handling if needed
    }
};