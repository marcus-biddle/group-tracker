import axiosInstance from "./axiosInstance";

export const retrieveUsers = async () => {
    try {
      const response = await axiosInstance.get('/players');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve players.');
    }
  };

  export const retrieveUserInfo = async (userId) => {
    try {
      const response = await axiosInstance.post('/api/user/info', { user_id: userId }); // Sending user_id in the request body
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve user info.');
    }
  };
  