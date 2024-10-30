import React, { useEffect, useState } from 'react'
import { Introduction } from './Introduction'
import { IntroList } from './IntroList'
import { retrieveExercises } from '../../api/exerciseApi';
import { retrieveUsers } from '../../api/playersApi';
import Banner from '../../components/Banner';

export const Home = () => {
  const [ exerciseList, setExerciseList ] = useState([]);
  const [ playerList, setPlayerList ] = useState([]);

    const fetchExercises = async () => {
        try {
            const data = await retrieveExercises();
            console.log('Successfully retrieved exercises:', data);
            setExerciseList(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    }

    const fetchPlayerList = async () => {
      try {
        const data = await retrieveUsers();
        console.log('Successfully retrieved players:', data);
        setPlayerList(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }

    useEffect(() => {
        fetchExercises();
        fetchPlayerList();
    }, []);

  return (
    <div className=''>
      {/* <Banner /> */}
        <Introduction activityCount={exerciseList.length} playerCount={playerList.length} />
        <IntroList exerciseList={exerciseList} />
    </div>
  )
}
