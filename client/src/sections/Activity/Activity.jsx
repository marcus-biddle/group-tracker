import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TfiBolt, TfiFilter, TfiBackRight } from "react-icons/tfi";
import { FilterModal } from '../../components/FilterModal';
import { AddModal } from '../../components/AddModal';
import { retrieveExerciseLog } from '../../api/exerciseApi';
import { isAuthenticated } from '../../helpers/authHelper';

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

export const Activity = () => {
  const { activityId, activityname } = useParams();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [ month, setMonth ] = useState(new Date().getMonth() + 1);
  const [ year, setYear ] = useState(new Date().getFullYear());
  const [ exerciseLog, setExerciseLog ] = useState([]);

  console.log(month, year)

  const fetchExerciseLog = async () => {
    const data = await retrieveExerciseLog({ exerciseId: activityId, month: month, year: year });
    console.log('fetching log: ', data);
    setExerciseLog(data);
  }

  const handleSave = (selectedMonth, selectedYear) => {
    if (selectedMonth === month && selectedYear === year) {
      setShowFilterModal(false);
      return;
    }
    setMonth(selectedMonth);
    setYear(selectedYear);
    setShowFilterModal(false);
  }

  useEffect(() => {
    fetchExerciseLog();
  }, [month, year, showAddModal])

  return (
    <div className=' relative min-h-[100vh]'>
      {/* <button onClick={() => goBack()} className=' bg-transparent flex justify-left mx-6 w-28 py-0 pl-0'>
        <TfiBackRight className=' w-4 h-4' />
        <p className=' font-extralight'>Go Back</p>
      </button> */}
      <div className=' p-6 '>
        <h1 className=' capitalize font-bold'>{activityname}</h1>
        <div className=' flex justify-between items-baseline'>
          <p className=' text-neutral-600 font-mono text-lg'>Top Player: Cal Ochoa</p>
        </div>
      </div>

      <div className='bg-neutral-800 rounded-t-3xl h-[100vh] p-8 text-gray-400'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg text-white tracking-wider font-semibold'>{months.find(m => m.value === month)?.name} {year}</h2>
          <div className='flex gap-2'>
            <button onClick={() => setShowFilterModal(true)} className=' bg-rose-500 shadow-xl border border-rose-600 rounded-md text-center flex justify-center items-center'>
              <TfiFilter className='w-full h-full text-neutral-800' />
            </button>
            {
              isAuthenticated() &&
              <button onClick={() => setShowAddModal(true)} className='min-w-16 h-10 bg-rose-500 rounded-md text-center flex justify-center items-center border border-rose-600 shadow-xl'>
                <TfiBolt className=' w-6 h-6 text-neutral-800'/>
                {/* <p className='text-white px-2 uppercase'>Add</p> */}
              </button>
            }
          </div>
        </div>
        
        <div className="flex justify-center">
          <table className="min-w-full table-auto rounded-lg border-collapse  mt-6">
            <thead className=''>
              <tr className="">
                <th className=" rounded-md px-4 py-2">Name</th>
                <th className="rounded-md px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {exerciseLog.map((person, index) => (
                <tr key={index} className="hover:bg-cyan-300 border-b-2 border-b-cyan-500">
                  <td className="p-4 text-center text-lg">{person.fullname}</td>
                  <td className="p-4 text-center text-lg">{person.total_exercise_count}</td>
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
