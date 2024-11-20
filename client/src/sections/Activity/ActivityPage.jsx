import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { retrieveAllExerciseLogsGroupedByUser, retrieveExerciseLog } from '../../api/exerciseApi';
import { MdOutlineLeaderboard } from "react-icons/md";
import { useHeaderData } from '../../context/HeaderDataContext';

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
      <div className='space-y-4 mx-2'>
        <div className="flex justify-between bg-transparent text-[#7C7986] rounded-md px-4 ">
          <div className=' flex justify-between w-full align-baseline items-baseline'>
            <div className='w-36 flex-wrap'>
              {/* DROPDOWN BUTTON FOR EXERCISE LEADERBOARD */}
              <div className="relative inline-block text-left">
                <span className=' text-[14px]'>Order By Exercise:</span>
                <button
                  onClick={toggleDropdown}
                  className="inline-flex justify-between items-center text-center w-32 h-8 px-4 py-2 text-sm font-medium text-[#00B2CC] bg-[#322a37] bg-opacity-75 rounded-md"
                >
                  <div>
                    <MdOutlineLeaderboard className=' h-full scale-125' />
                  </div>
                  <div className='w-full capitalize'>{dropdownSelection === null ? 'None' : dropdownSelection}</div>
                </button>

                  {isOpen && (
                    <div className="absolute z-10 mt-2 w-28 origin-top-right rounded-md shadow-lg">
                      <ul className="py-1 text-[#00B2CC] bg-[#322a37]" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                        {exerciseList.map((exercise, index) => (
                          <li key={index} onClick={() => handleExerciseDropdown(exercise)} className="block capitalize font-semibold px-4 py-2 text-sm ">
                              {exercise}
                          </li>
                        ))}
                        <li onClick={() => handleExerciseDropdown(null)} className="block capitalize font-semibold px-4 py-2 text-sm ">
                              None
                          </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className='flex justify-evenly gap-8'>
              {exerciseList.map((exercise, index) => (
                <div key={index} className='w-10 text-right text-[14px] capitalize'>
                  {exercise}
                </div>
              ))}
              </div>
            </div>
        </div>
        {exerciseLog.map((person, index) => (
          <div
          key={index}
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ delay: index * 0.2 }}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;


