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

export const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

export const Activity = () => {
  const { activityId, activityname } = useParams();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ month, setMonth ] = useState(currentMonth);
  const [ year, setYear ] = useState(currentYear);
  const [ exerciseLog, setExerciseLog ] = useState([]);
  const [ streaks, setStreaks ] = useState([]);

  const isFilterOn = new Date().getMonth() + 1 !== month || new Date().getFullYear() !== year;
  console.log(isFilterOn);

  console.log(month, year)

  const fetchExerciseLog = async () => {
    const data = await retrieveExerciseLog({ exerciseId: activityId, month: month, year: year });
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

  const handleSave = (selectedMonth, selectedYear) => {
    if (selectedMonth === month && selectedYear === year) {
      setShowFilterModal(false);
      return;
    }
    setMonth(selectedMonth);
    setYear(selectedYear);
    setShowFilterModal(false);
  }

  const resetFilter = () => {
    setMonth(currentMonth);
    setYear(currentYear);
  }

  const activityStreakFound = streaks.find(s => s.exercise_id === parseInt(activityId, 10)) || { exercise_id: activityId, streak_number: 0, last_updated: null };
  const activityStreak = activityStreakFound.streak_number || 0;
  console.log(activityStreak);

  useEffect(() => {
    fetchExerciseLog();
    fetchStreaks();
  }, [month, year, showAddModal])

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
          <Text size='large' color='mutedText'>{months.find(m => m.value === month)?.name} {year}</Text>
          <div className='flex gap-2'>
            <Button size='medium' onClick={() => setShowFilterModal(true)}>
              <TfiFilter className='w-full h-full ' />
            </Button>

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

        <div className=' flex justify-end mt-2'>
          {isFilterOn && <button onClick={resetFilter} className='underline underline-offset-2 text-sm text-primary p-0 bg-transparent'>Reset</button>}
        </div>
        
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
      <FilterModal showModal={showFilterModal} setShowModal={setShowFilterModal} onSave={handleSave} />
      <AddModal showModal={showAddModal} setShowModal={setShowAddModal} />
    </div>
  )
}
