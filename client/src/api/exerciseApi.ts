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
      console.log(exerciseFilters, response)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Could not retrieve exercises.');
    }
  };

  export const logExercise = async (exerciseData: ExerciseLogData) => {
    console.log('api file', exerciseData)
    try {
        const response = await axiosInstance.post('/exercises/log/insert', exerciseData);
        return response.data; // Return the response data
    } catch (error) {
        console.error('Error logging exercise:', error);
        throw error; // Re-throw the error for further handling if needed
    }
};