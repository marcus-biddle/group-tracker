import React, { useState } from 'react'

export const ProfilePage = () => {
    const [userData, setUserData] = useState([]);
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
