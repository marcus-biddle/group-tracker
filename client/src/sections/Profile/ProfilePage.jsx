import React, { useEffect, useState } from 'react'
import { deleteRecord, retrieveExerciseLogByUser, updateExercise } from '../../api/exerciseApi';
import { getUserId } from '../../helpers/authHelper';
import { BsThreeDotsVertical } from "react-icons/bs";
import {motion} from 'framer-motion'
import { useNavigate } from 'react-router';

const userId = getUserId();

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

      const navigate = useNavigate();

    
      const handleSave = async() => {
        try {
            await updateExercise({
                log_id: activeEntry.exercises.log_id, 
                date: entryDate, 
                exercise_count: entryCount
              })
              fetchUserData();
              openEntryModal(false);
        } catch {
            navigate('/auth')
        }
        
      };

      console.log(userData)
    
      const handleDelete = async() => {
        try {
            deleteRecord(activeEntry.exercises.log_id)
            setUserData((prevUserData) => {
                return prevUserData.map((entry) => {
                  if (entry.date === activeEntry.date) {
                    // Filter out the exercise with the log_id from the exercises array
                    return {
                      ...entry,
                      exercises: entry.exercises.filter(
                        (exercise) => exercise.log_id !== activeEntry.exercises.log_id
                      ),
                    };
                  }
                  return entry;
                });
              });
            openEntryModal(false);
        } catch {
            navigate('/auth')
        }
        
      };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
  };

  const handleEntry = (date, item) => {
    console.log(item);
    setActiveEntry({
        date: date,
        exercises: item
    })
    setEntryCount(item.total_exercise_count);
    setEntryDate(date)
    openEntryModal(true);
  }
    

    const fetchUserData = async () => {
        const data = await retrieveExerciseLogByUser({user_id: userId});

        const filteredData = data[0].dates.filter(item => {
            const logDate = new Date(item.date);  
            return logDate >= new Date(startDate) && logDate <= new Date(endDate);
        });

        setUserData(filteredData);
        console.log(filteredData);
    }

    useEffect(() => {
        fetchUserData();
    }, [endDate, startDate]);
    
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
                    className="p-2 rounded-md bg-[#322a37] text-[#00B2CC] box-border"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="endDate" className="text-white mb-2">End Date</label>
                    <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="p-2 rounded-md bg-[#322a37] text-[#00B2CC] box-border "
                    />
                </div>
            </div>
            {userData.map((entry, index) => (
                <div key={index} className='my-4'>
                    <div className='text-[#00B2CC]'>{entry.date}</div>
                    <div className='flex flex-col gap-4 text-[#C1BFCD]'>
                        {entry.exercises.map((item, index) => (
                            <button onClick={() => handleEntry(entry.date, item)} key={index} className='flex text-center capitalize justify-between bg-[#322a37] bg-opacity-90 rounded-md shadow-lg p-4'>
                                <p>{item.exercise_name}</p>
                                <div className='flex text-center items-center gap-6'>
                                    <p>{item.total_exercise_count}</p>
                                    <BsThreeDotsVertical className=' h-6 w-6' />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <>
        {entryModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <motion.div 
              initial={{ scale: 0.8 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.8 }} 
              className="bg-[#19121D] text-[#CFCDDD] p-6 rounded-lg shadow-lg w-full max-w-md"
            >
              <h2 className="text-2xl font-semibold mb-4">Edit Record</h2>
  
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Date</label>
                <input
                  type="date"
                  value={entryDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#322a37] border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
  
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Count</label>
                <input
                  type="number"
                  value={entryCount}
                  onChange={(e) => setEntryCount(e.target.value)}
                  className="w-full p-2 rounded-md bg-[#322a37] border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
  
              <div className="flex justify-end space-x-4">
                <button 
                    onClick={handleDelete} 
                    className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition text-white"
                  >
                  Delete
                </button>
                <button 
                  onClick={() => openEntryModal(false)} 
                  className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </>
    </div>
  )
}
