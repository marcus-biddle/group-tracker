import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { retrieveAllExerciseLogsGroupedByUser, retrieveExerciseLog } from '../../api/exerciseApi';
import { MdOutlineLeaderboard } from "react-icons/md";
import { useHeaderData } from '../../context/HeaderDataContext';
import { months } from '../TopNav';

const exerciseList = ['pushups', 'pullups', 'running'];
const ActivityPage = () => {
  const { headerData } = useHeaderData();
  const [ exerciseLog, setExerciseLog ] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownSelection, setDropdownSelection] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleExerciseDropdown = (exercise) => {
    setDropdownSelection(exercise);
    setIsOpen(false);
  }

  const fetchExerciseLog = async () => {
      const data = await retrieveAllExerciseLogsGroupedByUser({ 
        month: headerData.date.month, 
        year: headerData.date.year, 
        day: headerData.date.day
      }, dropdownSelection);
      console.log('FIRST fetching log: ', data);
      setExerciseLog(data);
  }

  useEffect(() => {
    fetchExerciseLog();
  }, [dropdownSelection, headerData])

  return (
    <div className="my-8">
      <div className='space-y-4 mx-4'>
        <div className="flex justify-end text-[#7C7986]">
          <div className=' flex align-baseline justify-items-end'>
            <div className='w-36 flex-wrap'>
              {/* DROPDOWN BUTTON FOR EXERCISE LEADERBOARD */}
              <div className="relative inline-block text-left">
                <span className=' text-[14px]'>Order By Exercise:</span>
                <button
                  onClick={toggleDropdown}
                  className="inline-flex justify-between items-center text-center gap-4 min-w-36 text-[#00B2CC] bg-[#322a37] bg-opacity-75 rounded-lg bordee border-[#322a37]  active:scale-95 transition-transform duration-150"
                >
                  <div>
                    <MdOutlineLeaderboard className=' h-full scale-125' />
                  </div>
                  <div className='w-full capitalize'>{dropdownSelection === null ? 'None' : dropdownSelection}</div>
                </button>

                {isOpen && (
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.25 }}
                      className="absolute z-10 mt-2 w-36 origin-top-right rounded-lg shadow-lg"
                    >
                      <ul
                        className="py-1 text-[#00B2CC] bg-[#322a37] rounded-lg"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="menu-button"
                      >
                        {exerciseList.map((exercise, index) => (
                          <li
                            key={index}
                            onClick={() => handleExerciseDropdown(exercise)}
                            className="block capitalize font-semibold px-4 py-2 hover:bg-[#444]"
                          >
                            {exercise}
                          </li>
                        ))}
                        <li
                          onClick={() => handleExerciseDropdown(null)}
                          className="block capitalize font-semibold px-4 py-2 hover:bg-[#444]"
                        >
                          None
                        </li>
                      </ul>
                    </motion.div>
                  </AnimatePresence>
                )}

                </div>
              </div>
              {/* <div className='flex justify-evenly gap-8'>
              {exerciseList.map((exercise, index) => (
                <div key={index} className='w-10 text-right text-[14px] capitalize'>
                  {exercise}
                </div>
              ))}
              </div> */}
            </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {exerciseLog.map((person, index) => (
            <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
              className="text-white items-center align-middle text-center bg-[#1E1B22] border border-[#24303E] rounded-md p-4 shadow-lg"
            >
              <p className="font-semibold text-[#00B2CC] text-left px-2">{person.fullname}</p>
              <hr className="border-gray-300 m-2 opacity-40" />
              <div className="flex justify-evenly flex-wrap mt-2">
                {person.exercises.map((exercise, exerciseIndex) => (
                  <div 
                    key={exerciseIndex} 
                    className="p-2 rounded-md m-1 text-sm "
                  >
                    <span className=' text-[32px]'>{exercise.total_exercise_count}</span> 
                    <span className=' opacity-50'>{' '}{exercise.exercise_name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {exerciseLog.length < 1 && <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-white items-center align-middle text-center">
          <span>
            No records shown for {months[headerData.date.month-1].name} {headerData.date.day === -1 ? '' : `${headerData.date.day},`} {headerData.date.year}
          <br /> please try a new date on the <span className='text-[#00B2CC]' onClick={() => null}>calendar</span>
          </span>
        </div>}
        
        {/* {exerciseLog.map((person, index) => (
          <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          // onClick={() => handleRecordClick(person.user_id, person.log_id)}
          className="flex justify-between bg-[#291B34] bg-opacity-85 text-[#918E9D] rounded-md px-4 py-4"
          >
            <div className=' flex justify-between w-full'>
              <div className='w-36 flex-wrap'>{person.fullname}</div>
              <div className='flex justify-evenly gap-8'>
              {person.exercises.map((exercise, index) => (
                <div key={index} className='w-10 text-right '>
                  {exercise.total_exercise_count}
                </div>
              ))}
              </div>
            </div>
          </motion.div>
        ))} */}
      </div>
    </div>
  );
};

export default ActivityPage;


