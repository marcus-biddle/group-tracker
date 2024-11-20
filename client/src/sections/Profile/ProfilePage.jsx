import React, { useEffect, useState } from 'react'
import { retrieveExerciseLogByUser } from '../../api/exerciseApi';
import { getUserId } from '../../helpers/authHelper';

export const ProfilePage = () => {
    const [userData, setUserData] = useState([]);
    const userId = getUserId();

    const fetchUserData = async () => {
        const data = await retrieveExerciseLogByUser({user_id: userId});
        setUserData(data);
        console.log(data)
    }

    useEffect(() => {

    }, [])
  return (
    <div className='p-8 flex flex-col gap-y-8'>
        <div>
            <h3 className='text-white text-[18px]'>Your Stats</h3>
            <div className='bg-[#291B34] rounded-md shadow-lg p-4 flex flex-col gap-2'>
                <p>Streak:</p>
                <p>Total Entries:</p>
                <p>Total Count:</p> 
            </div>
        </div>
        <div>
            <h3 className='text-white text-[18px]'>Your Entries</h3>
            <div className='bg-[#291B34] rounded-md shadow-lg p-4 flex flex-col gap-2'>
test
            </div>
        </div>
    </div>
  )
}
