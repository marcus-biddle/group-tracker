// src/api/authApi.ts
import axiosInstance from './axiosInstance';

// Interface for login and signup requests
interface ExerciseData {
    exercise_id: number,
    exercise_name: string
}

export const retrieveExercises = async (data: ExerciseData) => {
  try {
    const response = await axiosInstance.get('/exercises');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Could not retrieve exercises.');
  }
};