import React, { useEffect, useState } from 'react'
import { deleteRecord, retrieveExerciseLogByUser, updateExercise } from '../../api/exerciseApi';
import { getUserId } from '../../helpers/authHelper';
import { BsThreeDotsVertical } from "react-icons/bs";
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router';
import { retrieveUserInfo } from '../../api/playersApi';

const userId = getUserId();

function daysSince(dateString) {
  const givenDate = new Date(dateString); // Parse the input date
  const currentDate = new Date(); // Get the current date
  
  // Calculate the difference in milliseconds
  const diffInMilliseconds = currentDate - givenDate;
  
  // Convert milliseconds to days
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
}

function getInitials(fullName) {
  if (!fullName) return '';

  // Split the name into parts by spaces
  const nameParts = fullName.trim().split(' ');

  // Map over each part and take the first character, then join them as uppercase
  const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');

  return initials;
}


export const ProfilePage = () => {
    const getToday = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      };
    
      const getOneWeekAgo = () => {
        const today = new Date();
        today.setDate(today.getDate() - 7); // Subtract 7 days
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${yyyy}-${mm}-${dd}`;
      };

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Format to "yyyy-MM-dd" for input[type="date"]
        return date.toISOString().split('T')[0];
      };
    
      const [startDate, setStartDate] = useState(getOneWeekAgo());
      const [endDate, setEndDate] = useState(getToday());
      const [userData, setUserData] = useState([]);
      const [activeEntry, setActiveEntry] = useState({});
      const [entryModal, openEntryModal] = useState(false);
    
      const [entryDate, setEntryDate] = useState("");
      const [entryCount, setEntryCount] = useState('');

      const [userInfoData, setUserInfoData] = useState({});

      
    
      

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  

  const fetchUserInfoDate = async () => {
    const data = await retrieveUserInfo({user_id: userId});
    setUserInfoData(data);
    console.log('userInfodata',data)

  }
    

    

    useEffect(() => {
        // fetchUserData();
        fetchUserInfoDate();
    }, [endDate, startDate]);

    console.log(userInfoData)
    
  return (
    <div className='relative p-8 flex flex-col gap-y-8'>
        {/* <div>
            <h3 className='text-white text-[18px]'>Your Stats</h3>
            <div className='bg-[#291B34] rounded-md shadow-lg p-4 flex flex-col gap-2'>
                <p>Streak:</p>
                <p>Total Entries:</p>
                <p>Total Count:</p> 
            </div>
        </div> */}
        <div className='relative text-white bg-[#322a37] min-h-[150px] rounded-md pl-24'>
          <div className='absolute top-[-11px] left-[-11px] bg-[#111111] h-20 w-20 rounded-full z-10'></div>
          {Object.keys(userInfoData).length > 0 && <div className='absolute top-[-11px] left-[-11px] bg-transparent border-4 border-[#00B2CC] text-[#00B2CC] h-20 w-20 rounded-full z-10 scale-75 items-center flex justify-center text-2xl'>
            {getInitials(userInfoData.fullname)}
          </div>}
          {Object.keys(userInfoData).length > 0  && <div className='mr-4'>
            <div className='flex items-center justify-between my-2'>
              <p className=' uppercase py-2'>{userInfoData.exercises[0].exercise_name}</p>
              <p className=''>{userInfoData.exercises[0].total_count}</p>
            </div>
            <hr className="border-gray-300 opacity-40 mb-4" />
            {/* <div className='flex flex-row capitalize justify-between items-baseline w-[80%] '>
              <p>{userInfoData.exercises[0].exercise_name} Count</p>
              <p className='text-[2rem] p-0 m-0'>{userInfoData.exercises[0].total_count}</p>
            </div> */}
            <div className='flex items-center justify-between mb-2'>
              <span>Last Entry:</span>
              <span>{daysSince(userInfoData.exercises[0].last_log_date) === 0 ? 'Today' : daysSince(userInfoData.exercises[0].last_log_date) === 1 ? `${daysSince(userInfoData.exercises[0].last_log_date)} day ago` : `${daysSince(userInfoData.exercises[0].last_log_date)} days ago`}</span>
            </div>
            <div className='flex items-center justify-between'>
              <span>Elapsed Time:</span>
              <span>{userInfoData.exercises[0].days_logged} days</span>
            </div>
            <p></p>
          </div>}
        </div>
        <div>
            <h3 className='text-white text-[18px]'>Your Entries</h3>
            <div className="flex items-center space-x-4 bg-[#120D18] p-4 rounded-md shadow-md">
                <div className="flex flex-col">
                    <label htmlFor="startDate" className="text-white mb-2">Start Date</label>
                    <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="p-2 rounded-md bg-[#322a37] text-[#00B2CC] box-border caret-transparent"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-white mb-2">End Date</label>
                    <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="p-2 rounded-md bg-[#322a37] text-[#00B2CC] box-border caret-transparent"
                    />
                </div>
            </div>
            
        </div>
        
    </div>
  )
}
