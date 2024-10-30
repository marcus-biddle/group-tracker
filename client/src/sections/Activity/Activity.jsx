import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TfiBolt, TfiFilter } from "react-icons/tfi";
import { FilterModal } from '../../components/FilterModal';
import { AddModal } from '../../components/AddModal';
import { retrieveExerciseLog } from '../../api/exerciseApi';
import { isAuthenticated } from '../../helpers/authHelper';
import Button from '../../components/Button';
import Text from '../../components/Text';
import Header from '../../components/Header';
import { FaFire } from "react-icons/fa";
import { retrieveStreak } from '../../api/streakApi';
import PopupDialog from '../../components/PopupDialog';
import Calendar from '../../components/Calendar';
import { BsFillCalendarEventFill } from "react-icons/bs";
import { motion } from 'framer-motion'
import { MdAdd } from "react-icons/md";
import { GoPersonAdd, GoPlus, GoCalendar, GoGraph } from "react-icons/go";
import UserSelectModal from '../../components/userSelectModal';
import { FaTimes } from 'react-icons/fa';

export const months = [
  { name: 'January', value: 0 },
  { name: 'February', value: 1 },
  { name: 'March', value: 2 },
  { name: 'April', value: 3 },
  { name: 'May', value: 4 },
  { name: 'June', value: 5 },
  { name: 'July', value: 6 },
  { name: 'August', value: 7 },
  { name: 'September', value: 8 },
  { name: 'October', value: 9 },
  { name: 'November', value: 10 },
  { name: 'December', value: 11 },
];

export const Activity = () => {
  const { activityId, activityname } = useParams();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  // const [ month, setMonth ] = useState(currentMonth);
  // const [ year, setYear ] = useState(currentYear);
  const [ exerciseLog, setExerciseLog ] = useState([]);
  const [ streaks, setStreaks ] = useState([]);

  const [ userSelectModal, setUserSelectModal ] = useState(false);
  

  const [ showCalendar, setShowCalendar ] = useState(false);
  const [ date, setDate ] = useState({
    day: -1,
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  const [ activeFilters, setActiveFilters ] = useState({
    user: null,
    date: date
  })

  console.log('Active Filter', activeFilters)
  // const isFilterOn = new Date().getMonth() + 1 !== month || new Date().getFullYear() !== year;
  // console.log(isFilterOn);

  // console.log(month, year)

  const fetchExerciseLog = async () => {
    if (activeFilters.user !== null) {
      const data = await retrieveExerciseLogByUser({
        exercise_id: activityId, 
        user_id: activeFilters.user.user_id,
        month: date.month+1, 
        year: date.year, 
        day: date.day 
      })
      console.log('fetching user logs', data)
    } else {
      const data = await retrieveExerciseLog({ 
        exercise_id: activityId, 
        month: date.month+1, 
        year: date.year, 
        day: date.day 
      });
      console.log('fetching log: ', data);
      setExerciseLog(data);
    }
    
  }

  const fetchStreaks = async () => {
    try {
      const data = await retrieveStreak();
      console.log('fetching streaks', data);
      setStreaks(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized access. Clearing streaks.');
        setStreaks([]);
      } else {
        console.error('Error fetching streaks:', error);
      }
    }
  };

  // For Calendar
  const handleUpdatingTable = async (chosenDate) => {
    console.log(chosenDate);
    setDate(chosenDate);
    const data = await retrieveExerciseLog({
      exercise_id: activityId,
      month: chosenDate.month+1,
      year: chosenDate.year,
      day: chosenDate.day
    })
    setExerciseLog(data);
    setShowCalendar(false);
  }

  // const handleSave = (selectedMonth, selectedYear) => {
  //   if (selectedMonth === month && selectedYear === year) {
  //     setShowFilterModal(false);
  //     return;
  //   }
  //   setMonth(selectedMonth);
  //   setYear(selectedYear);
  //   setShowFilterModal(false);
  // }

  // const resetFilter = () => {
  //   setMonth(currentMonth);
  //   setYear(currentYear);
  // }

  const activityStreakFound = streaks.find(s => s.exercise_id === parseInt(activityId, 10)) || { exercise_id: activityId, streak_number: 0, last_updated: null };
  const activityStreak = activityStreakFound.streak_number || 0;

  useEffect(() => {
    fetchExerciseLog();
    fetchStreaks();
  }, [])

  return (
    <div className=' relative min-h-[100vh]'>
      <section className=' p-6 '>
        <h1 className='text-5xl font-semibold text-[#C1BECC] capitalize'>{activityname}</h1>
        {/* <Text size='large' color='secondaryText'>Top Player: Cal Ochoa</Text> */}
        <div className='mt-4 space-x-4'>
          <PopupDialog
            trigger={
              <div className={` ${isAuthenticated() ? 'text-[#E53981]' : 'text-mutedText'} border border-secondaryMenu inline-flex items-center px-3 py-1 rounded-md font-semibold space-x-1`}>
              <FaFire />
              <span>{activityStreak}</span>
              </div>
            }
            content={isAuthenticated() ? <p>Your Current Streak.</p> : <p>Please login to view your streak.</p>}
            onHover={true} 
            position="bottom"  
          />
          {/* <div className='text-primaryText border border-secondaryMenu inline-flex items-center px-3 py-1 rounded-md font-semibold'>
            <FaFire />
            0
          </div> */}
          
        </div>
      </section>

      <div className=' p-4'>
        {/* <div className='flex justify-between items-end'>
          <Text size='large' color='mutedText'>{months.find(m => m.value === date.month)?.name}{`${date.day !== -1 ? ` ${date.day},` : ''}`} {date.year}</Text>
          <div className='flex gap-2'>
            <button onClick={() => setShowCalendar(true)} className="transition-transform duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none 
             focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 active:bg-opacity-80 bg-blue-600 text-white rounded-md 
             px-4 py-2 shadow-lg">
              <BsFillCalendarEventFill />
            </button>

            <PopupDialog
            trigger={
              <Button size='medium' onClick={() => setShowAddModal(true)} disabled={!isAuthenticated()}>
                <TfiBolt className=' w-6 h-6'/>
              </Button>
            }
            content={isAuthenticated() ? '' : <p>Please login to update your count.</p>}
            onHover={true} 
            position="left"  
          />
          </div>
        </div> */}

        {/* <div>
          test
        </div> */}

        <div className='bg-[#19141e] my-4 p-4 rounded-md relative flex justify-evenly shadow-md'>
          <button onClick={() => setShowAddModal(true)} className=' bg-transparent active:bg-[#201726]'>
            <GoPlus className='text-[#84818D] text-4xl' />
          </button>
          <div className="border-l-2 border-[#84818D] border-opacity-50"></div>
          <button onClick={() => setShowCalendar(true)} className=' bg-transparent active:bg-[#201726]'>
            <GoCalendar className='text-[#84818D] text-4xl' />
          </button>
          <button onClick={() => setUserSelectModal(true)} className=' bg-transparent active:bg-[#201726]'>
            <GoPersonAdd className='text-[#84818D] text-4xl' />
          </button>
          <button className=' bg-transparent active:bg-[#201726]'>
            <GoGraph className='text-[#84818D] text-4xl' />
          </button>
        </div>

        {/* <div className=' flex justify-end mt-2'>
          {isFilterOn && <button onClick={resetFilter} className='underline underline-offset-2 text-sm text-primary p-0 bg-transparent'>Reset</button>}
        </div> */}
        {activeFilters.user !== null && <div className=' text-[#84818D] py-4 space-y-2'>
          <p>Active Filters</p>
          <button onClick={() => setActiveFilters({
            user: null,
            date: date
          })} className='flex gap-2 items-center bg-[#322a37] bg-opacity-75 font-thin bg-transparent'>
            <FaTimes className='text-[#00B2CC]'/>
            <span>{activeFilters.user.fullname}</span>
          </button>
        </div>}
        
        <div className="flex flex-col px-6 justify-center relative bg-[#291B34] rounded-md shadow-lg overflow-hidden">
          <div className='bg-transparent flex justify-between w-full py-3 items-center font-semibold text-[#C3BFCF]'>
            <span>{months.find(m => m.value === date.month)?.name}{`${date.day !== -1 ? ` ${date.day},` : ''}`} {date.year}</span>
            {/* <div onClick={() => setActiveButton('')} className=' border border-[#00B2CC] text-[#00B2CC] font-semibold rounded-md text-2xl flex justify-center items-center px-3 pb-1'>
                &times;
            </div> */}
          </div>
            
            

            <div className='w-full mb-6 rounded-md p-8 bg-[#120D18] shadow-md space-y-4'>
              <div className="flex justify-between bg-[#19121D] text-[#918E9D] rounded-md px-4 py-3">
                <span>Rank</span>
                <span>Name</span>
                <span>Count</span>
              </div>
              <div className='space-y-4'>
                {exerciseLog.map((person, index) => (
                  <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="flex justify-between bg-[#201726] text-[#918E9D] rounded-md px-4 py-3"
                  >
                    <span>{index +1}</span>
                    <span>{person.fullname}</span>
                    <span>{person.total_exercise_count}</span>
                  </motion.div>
                ))}
              </div>
              
              {/* <table className="min-w-full table-auto rounded-lg border-collapse  mt-6">
                <thead className=''>
                  <tr className="">
                    <th className=" rounded-md px-4 py-2 w-[10%]">Rank</th>
                    <th className=" rounded-md px-4 py-2 w-[80%]">Name</th>
                    <th className="rounded-md px-4 py-2 w-[10%]">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseLog.map((person, index) => (
                    <tr key={index} className="hover:bg-primary border-b-2 border-b-primary rounded-md text-primaryText">
                      <td className="p-4 text-center text-lg">{index + 1}</td>
                      <td className="p-4 text-center text-lgfont-semibold">{person.fullname}</td>
                      <td className="p-4 text-center text-lg">{person.total_exercise_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
            </div>
          
        </div>
      </div>
      {/* <FilterModal showModal={showFilterModal} setShowModal={setShowFilterModal} onSave={{}} /> */}
      <AddModal showModal={showAddModal} setShowModal={setShowAddModal} />
      {showCalendar && <div className=' absolute top-0 h-screen flex justify-center items-center w-full px-6 bg-black bg-opacity-50'>
        <Calendar setShowCalendar={setShowCalendar} setDate={setDate} date={date} handleUpdatingTable={handleUpdatingTable} />
      </div>}
      <UserSelectModal isOpen={userSelectModal} onClose={() => setUserSelectModal(false)} users={exerciseLog} onSelectUser={(user) => setActiveFilters({
        user: user,
        date: date
      })} />
    </div>
  )
}
