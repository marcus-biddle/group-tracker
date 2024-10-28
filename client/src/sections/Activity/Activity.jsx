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

  const [ showCalendar, setShowCalendar ] = useState(false);
  const [ date, setDate ] = useState({
    day: -1,
    month: new Date().getMonth(),
    year: new Date().getFullYear()
  })

  // const isFilterOn = new Date().getMonth() + 1 !== month || new Date().getFullYear() !== year;
  // console.log(isFilterOn);

  // console.log(month, year)

  const fetchExerciseLog = async () => {
    const data = await retrieveExerciseLog({ 
      exercise_id: activityId, 
      month: date.month+1, 
      year: date.year, 
      day: date.day 
    });
    console.log('fetching log: ', data);
    setExerciseLog(data);
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

  const handleUpdatingTable = async (chosenDate) => {
    console.log(chosenDate);
    setDate(chosenDate);
    await retrieveExerciseLog({
      exercise_id: activityId,
      month: chosenDate.month+1,
      year: chosenDate.year,
      day: chosenDate.day
    })
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
      <div className=' p-6 '>
        <Header level="h1" color="primaryText">{activityname}</Header>
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
      </div>

      <div className='bg-secondaryMenu rounded-t-3xl h-[100vh] p-8 text-gray-400'>
        <div className='flex justify-between items-end'>
          <Text size='large' color='mutedText'>{months.find(m => m.value === date.month)?.name}{`${date.day !== -1 ? ` ${date.day},` : ''}`} {date.year}</Text>
          <div className='flex gap-2'>
            <button onClick={() => setShowCalendar(true)} className="transition-transform duration-300 ease-out transform hover:scale-105 active:scale-95 focus:outline-none 
             focus:ring-2 focus:ring-blue-100 focus:ring-opacity-50 active:bg-opacity-80 bg-blue-600 text-white rounded-md 
             px-4 py-2 shadow-lg">
              <BsFillCalendarEventFill />
            </button>
            {/* <Button size='medium' onClick={() => setShowFilterModal(true)}>
              <TfiFilter className='w-full h-full ' />
            </Button> */}

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
        </div>

        {/* <div className=' flex justify-end mt-2'>
          {isFilterOn && <button onClick={resetFilter} className='underline underline-offset-2 text-sm text-primary p-0 bg-transparent'>Reset</button>}
        </div> */}
        
        <div className="flex justify-center">
          <table className="min-w-full table-auto rounded-lg border-collapse  mt-6">
            <thead className=''>
              <tr className="">
                <th className=" rounded-md px-4 py-2">Rank</th>
                <th className=" rounded-md px-4 py-2">Name</th>
                <th className="rounded-md px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {exerciseLog.map((person, index) => (
                <tr key={index} className="hover:bg-primary border-b-2 border-b-primary rounded-md text-primaryText">
                  <td className="p-4 text-center text-lg w-1/6">{index + 1}</td>
                  <td className="p-4 text-center text-lg w-1/2 font-semibold">{person.fullname}</td>
                  <td className="p-4 text-center text-lg w-1/3">{person.total_exercise_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FilterModal showModal={showFilterModal} setShowModal={setShowFilterModal} onSave={{}} />
      <AddModal showModal={showAddModal} setShowModal={setShowAddModal} />
      {showCalendar && <div className=' absolute top-[20%] w-full px-6'>
        <Calendar setShowCalendar={setShowCalendar} setDate={setDate} date={date} handleUpdatingTable={handleUpdatingTable} />
      </div>}
    </div>
  )
}
