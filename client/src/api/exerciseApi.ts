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