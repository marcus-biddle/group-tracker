import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence,  } from 'framer-motion';
import { deleteRecord, retrieveAllExerciseLogsGroupedByUser, retrieveExerciseLog, retrieveExerciseLogByUser, updateExercise } from '../../api/exerciseApi';
import { MdOutlineLeaderboard } from "react-icons/md";
import { useHeaderData } from '../../context/HeaderDataContext';
import { months } from '../TopNav';
import { getUserId } from '../../helpers/authHelper';
import { useNavigate } from 'react-router';

import { BsThreeDotsVertical } from "react-icons/bs";
import { LuCalendarDays } from "react-icons/lu";
import './Activity.css'

const userId = getUserId();

const exerciseList = ['pushups', 'pullups', 'running'];

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
};

const ActivityPage = () => {
  const { headerData } = useHeaderData();
  const [ exerciseLog, setExerciseLog ] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownSelection, setDropdownSelection] = useState(exerciseList[0]);
  const [isAll, setIsAll] = useState(true);
  const [activeEntry, setActiveEntry] = useState({});
  const [entryModal, openEntryModal] = useState(false);
  const [userData, setUserData] = useState([]);
  const [entryDate, setEntryDate] = useState("");
      const [entryCount, setEntryCount] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);

  const toggleSwitch = () => setIsAll(!isAll);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleExerciseDropdown = (exercise) => {
    setDropdownSelection(exercise);
    setIsOpen(false);
  }

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

  const fetchExerciseLog = async () => {
      const data = await retrieveAllExerciseLogsGroupedByUser({ 
        month: headerData.date.month, 
        year: headerData.date.year, 
        day: headerData.date.day
      }, dropdownSelection);
      console.log('FIRST fetching log: ', data);
      if (data.length <= 0) {
        setExerciseLog(null);
        return;
      }
      setExerciseLog(data);
  }

  const fetchUserData = async () => {
    const data = await retrieveExerciseLogByUser({user_id: userId});

    const filteredData = data[0].dates.filter(item => {
      const logDate = new Date(item.date);
      const logMonth = logDate.getMonth();
      const logYear = logDate.getFullYear();
  
      return logMonth === headerData.date.month-1 && logYear === headerData.date.year;
    });

    setUserData(filteredData);
    console.log('user data', filteredData)
}

  useEffect(() => {
    fetchExerciseLog();
  }, [dropdownSelection, headerData])

  useEffect(() => {
    fetchUserData();
  }, [])

  return (
    <div className="my-8">
      <div className='flex justify-center items-center mb-10'>
      <div
      className="flex items-center justify-between w-32 h-10 p-1 px-4 bg-[#322a37] text-white rounded-full cursor-pointer"
      onClick={toggleSwitch}
    >
      {/* Left Label: Group */}
      <span
        className={` ${
          !isAll ? 'text-transparent' : 'text-[#00B2CC]'
        } transition-all duration-150`}
      >
        All
      </span>

      {/* Animated Switch */}
      <motion.div
        className="w-14 h-8 bg-[#1E1B22] rounded-full shadow-md"
        animate={{ x: isAll ? 38 : -29 }} // Use animate for smooth transition
        transition={{
          type: 'spring',
          stiffness: 200, // Slower movement
          damping: 40, // Smooth end
        }}
      />

      {/* Right Label: Yours */}
      <span
        className={` ${
          isAll ? 'text-transparent' : 'text-[#00B2CC]'
        } transition-all duration-150`}
      >
        You
      </span>
    </div>
      </div>
      
      <div className='space-y-4 m-4'>
      <div className="flex justify-between items-end  text-[#7C7986]">
      <AnimatePresence>
        <motion.button
        layoutId='calendar'
          className='bg-[#00B2CC] w-16 h-12'
          onClick={() => setCalendarOpen(true)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}>
          <LuCalendarDays className='w-full h-full text-black' />
        </motion.button>
      </AnimatePresence>
      
        <div>
          
        </div>
        
          <div className=' flex align-baseline justify-items-end'>
            <div className='w-36 flex-wrap'>
              {/* DROPDOWN BUTTON FOR EXERCISE LEADERBOARD */}
              <div className="relative">
                  <motion.nav
                  initial={false}
                  animate={isOpen ? "open" : "closed"}
                  className="menu"
                  style={{ position: 'relative'}}
                >
                  Exercise:
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setIsOpen(!isOpen)}
                    style={{ textTransform: 'capitalize'}}
                  >
                    {dropdownSelection}
                    <motion.div
                      variants={{
                        open: { rotate: 180 },
                        closed: { rotate: 0 }
                      }}
                      transition={{ duration: 0.2 }}
                      style={{ originY: 0.55 }}
                    >
                      <svg width="15" height="15" viewBox="0 0 20 20">
                        <path d="M0 7 L 20 7 L 10 16" />
                      </svg>
                    </motion.div>
                  </motion.button>
                  <motion.ul
                    variants={{
                      open: {
                        clipPath: "inset(0% 0% 0% 0% round 10px)",
                        transition: {
                          type: "spring",
                          bounce: 0,
                          duration: 0.7,
                          delayChildren: 0.3,
                          staggerChildren: 0.05
                        }
                      },
                      closed: {
                        clipPath: "inset(10% 50% 90% 50% round 10px)",
                        transition: {
                          type: "spring",
                          bounce: 0,
                          duration: 0.3
                        }
                      }
                    }}
                    style={{ pointerEvents: isOpen ? "auto" : "none", position: 'absolute' }}
                  >
                    {exerciseList.map((exercise) => (
                      <motion.li key={exercise} onClick={() => {
                        setDropdownSelection(exercise)
                        setIsOpen(false)
                      }} variants={itemVariants} style={{ textTransform: 'capitalize'}}>{exercise}</motion.li>
                    ))}
                  </motion.ul>
                </motion.nav>
                </div>
              </div>
            </div>
        </div>
      </div>

      {isAll && <div className='space-y-4 mx-4'>
        
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {exerciseLog.map((person, index) => (
            <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
              className="text-white items-center align-middle text-center flex justify-between px-8 bg-[#1E1B22] border border-[#24303E] rounded-md p-4 shadow-lg"
            >
              <p className="font-semibold text-[#00B2CC] text-[24px]">{person.fullname}</p>
              {/* <hr className="border-gray-300 m-2 opacity-40" /> */}
                {person.exercises.filter((e) => e.exercise_name === dropdownSelection).map((exercise, exerciseIndex) => (

                    <p key={exerciseIndex} className=' text-[32px]'>+{exercise.total_exercise_count}</p> 

                ))}
            </motion.div>
          ))}
          
        </div>
        {exerciseLog === null && <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-white items-center align-middle text-center">
          <span>
            No records shown for {months[headerData.date.month-1].name} {headerData.date.day === -1 ? '' : `${headerData.date.day},`} {headerData.date.year}
          <br /> please try a new date on the <span className='text-[#00B2CC]' onClick={() => null}>calendar</span>
          </span>
        </div>}
      </div>}

      {!isAll && <div className='space-y-4 mx-4'>
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
      </div>}
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

        {calendarOpen &&
        <motion.div layoutRoot className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center' onClick={() => setCalendarOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
          <motion.div layoutId="calendar">
            <div className="relative bg-[#191B1F] min-w-[300px] w-full min-h-[600px] rounded-md text-white p-4 flex flex-col justify-evenly">
              {/* Top: Select a Date */}
              <div className='relative min-h-[175px]'>
                <h3 className="text-lg font-semibold mb-4">Select a Date</h3>
                <input
                  type="date"
                  placeholder="YYYY-MM-DD"
                  pattern="\d{4}-\d{2}-\d{2}"
                  className="bg-[#282C34] text-white p-2 rounded-md border border-gray-600 w-full"
                />
                <motion.button
                className='absolute right-0 bottom-0 w-24 bg-[#00B2CC] text-black'
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  Update
                </motion.button>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 my-6">
                <hr className="flex-grow border-t border-gray-500" />
                <span className="text-gray-400 font-medium">OR</span>
                <hr className="flex-grow border-t border-gray-500" />
              </div>

              {/* Bottom: Select a Range */}
              <div className='relative min-h-[300px]'>
                <h3 className="text-lg font-semibold mb-4">Select a Range</h3>
                <div className="flex flex-col gap-4">
                  <label className="text-gray-400">
                    Start Date:
                    <input
                      type="date"
                      placeholder="YYYY-MM-DD"
                      pattern="\d{4}-\d{2}-\d{2}"
                      className="bg-[#282C34] text-white p-2 rounded-md border border-gray-600 w-full mt-2"
                    />
                  </label>
                  <label className="text-gray-400">
                    End Date:
                    <input
                      type="date"
                      placeholder="YYYY-MM-DD"
                      pattern="\d{4}-\d{2}-\d{2}"
                      className="bg-[#282C34] text-white p-2 rounded-md border border-gray-600 w-full mt-2"
                    />
                  </label>
                </div>
                <motion.button
                className='absolute right-0 bottom-0 w-24 bg-[#00B2CC] text-black'
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}>
                  Update
                </motion.button>
              </div>
            </div>
          </motion.div>

          </div>
        </motion.div>}
    </div>
  );
};

export default ActivityPage;


