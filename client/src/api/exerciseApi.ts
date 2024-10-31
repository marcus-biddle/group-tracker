// src/api/authApi.ts
import axiosInstance from './axiosInstance';

// Interface for login and signup requests
interface ExerciseTypeData {
    exercise_id: number,
    exercise_name: string
}

interface ExerciseLogData {
    exerciseId: number,
    month: number,
    year: number
}

interface ExerciseLogData { 
    user_id: string,
    exercise_count: number, 
    date: string, 
    exercise_id: string 
}

export const retrieveExercises = async () => {
  try {
    const response = await axiosInstance.get('/exercises');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not retrieve exercises.');
  }
};

export const retrieveExerciseLog = async (exerciseFilters: ExerciseLogData) => {
    try {
      const response = await axiosInstance.post('/exercises/log', exerciseFilters);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve exercises.');
    }
  };

  export const retrieveExerciseLogByUser = async (exerciseFilters: ExerciseLogData) => {
      try {
        const response = await axiosInstance.post('/exercises/log/user', exerciseFilters);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Could not retrieve exercises for user.');
      }
    };

export const logExercise = async (exerciseData: ExerciseLogData) => {
  try {
      const response = await axiosInstance.post('/exercises/log/insert', exerciseData);
      return response.data; // Return the response data
  } catch (error) {
      console.error('Error logging exercise:', error);
      throw error; // Re-throw the error for further handling if needed
  }
};

export const updateExercise = async (exerciseData: any) => {
  try {
      const response = await axiosInstance.put('/exercises/log', exerciseData);
      return response.data; 
  } catch (error) {
      console.error('Error logging exercise:', error);
  }
}

export const deleteRecord = async (recordId: any) => {
  try {
    const response = await axiosInstance.delete(`/records/${recordId}`);
    console.log('Record deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting record:', error.response?.data || error.message);
    throw error;
  }
};

export const addExercise = async (exerciseData) => {
  console.log(exerciseData)
  try {
      const response = await axiosInstance.post('/exercises/add', exerciseData);
      return response.data;
  } catch (error) {
      throw error.response ? error.response.data : error.message;
  }
};