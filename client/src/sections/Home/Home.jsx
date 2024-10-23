import React, { useEffect, useState } from 'react'
import { Introduction } from './Introduction'
import { IntroList } from './IntroList'
import { retrieveExercises } from '../../api/exerciseApi';

export const Home = () => {
  const [ exerciseList, setExerciseList ] = useState([]);

    const fetchExercises = async () => {
        try {
            const data = await retrieveExercises();
            console.log('Successfully retrieved exercises:', data);
            setExerciseList(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    }

    useEffect(() => {
        fetchExercises();
    }, []);

  return (
    <div className='bg-neutral-800'>
        <Introduction activityCount={exerciseList.length} />
        <IntroList exerciseList={exerciseList} />
    </div>
  )
}
