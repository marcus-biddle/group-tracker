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

    export const retrieveAllExerciseLogsGroupedByUser = async (exerciseFilters: ExerciseLogData, dropdownSelection: string) => {
      try {
        const response = await axiosInstance.post('/exercises/log/all', exerciseFilters);
        const formattedData = groupUsersById(response.data, dropdownSelection);
        return formattedData;
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
  try {
      const response = await axiosInstance.post('/exercises/add', exerciseData);
      return response.data;
  } catch (error) {
      throw error.response ? error.response.data : error.message;
  }
};

function groupUsersById(data: any, dropdownSelection: string) {
  const exerciseList = [
    { exercise_id: 1, exercise_name: "pushups" },
    { exercise_id: 2, exercise_name: "pullups" },
    { exercise_id: 3, exercise_name: "running" }
  ];

  const groupedData = {};

  data.forEach(item => {
    const { user_id, fullname, exercise_id, exercise_name, total_exercise_count } = item;

    // Check if the user already exists in the grouped data
    if (!groupedData[user_id]) {
      groupedData[user_id] = {
        user_id,
        fullname,
        exercises: [] // Initialize an empty array for exercises
      };
    }

    // Add the exercise details to the user's exercises array
    groupedData[user_id].exercises.push({
      exercise_id,
      exercise_name,
      total_exercise_count: parseInt(total_exercise_count, 10) // Ensure the count is a number
    });
  });

  // Ensure every user has placeholders for missing exercises
  Object.values(groupedData).forEach((user: any) => {
    const existingExerciseIds = user.exercises.map(exercise => exercise.exercise_id);

    exerciseList.forEach(exercise => {
      if (!existingExerciseIds.includes(exercise.exercise_id)) {
        // Add a placeholder with total_exercise_count set to 0
        user.exercises.push({
          exercise_id: exercise.exercise_id,
          exercise_name: exercise.exercise_name,
          total_exercise_count: 0
        });
      }
    });

    // Sort the exercises by exercise_id
    user.exercises.sort((a, b) => a.exercise_id - b.exercise_id);
  });

  // Convert the grouped object back to an array for easier usage
  let result = Object.values(groupedData);

  // Sort users by the selected exercise if dropdownSelection is not null
  if (dropdownSelection !== "null") {
    const selectedExercise = exerciseList.find(
      exercise => exercise.exercise_name === dropdownSelection
    );

    if (selectedExercise) {
      const selectedExerciseId = selectedExercise.exercise_id;

      result = result.sort((a: any, b: any) => {
        const aCount = a.exercises.find(
          (exercise: any) => exercise.exercise_id === selectedExerciseId
        )?.total_exercise_count || 0;

        const bCount = b.exercises.find(
          (exercise: any) => exercise.exercise_id === selectedExerciseId
        )?.total_exercise_count || 0;

        return bCount - aCount; // Descending order
      });
    }
  }

  return result;
}
