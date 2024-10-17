import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TfiBolt, TfiFilter, TfiBackRight } from "react-icons/tfi";
import { FilterModal } from '../../components/FilterModal';
import { AddModal } from '../../components/AddModal';

const data = [
  { name: 'John Doe', count: 5 },
  { name: 'Jane Smith', count: 3 },
  { name: 'Alex Johnson', count: 8 },
];

export const Activity = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const goBack = () => {
    navigate("/");
  }

  return (
    <div className=' relative min-h-[100vh]'>
      {/* <button onClick={() => goBack()} className=' bg-transparent flex justify-left mx-6 w-28 py-0 pl-0'>
        <TfiBackRight className=' w-4 h-4' />
        <p className=' font-extralight'>Go Back</p>
      </button> */}
      <div className=' p-6 '>
        <h1 className=' capitalize font-bold'>{activityId}</h1>
        <div className=' flex justify-between items-baseline'>
          <p className=' text-neutral-600 font-mono text-lg'>Top Player: Cal Ochoa</p>
          <button onClick={() => setShowAddModal(true)} className='min-w-16 h-10 bg-black rounded-lg text-center flex justify-center items-center border border-black shadow-2xl'>
            <TfiBolt className=' w-6 h-6 text-yellow-500 '/>
            <p className='text-white px-2 uppercase'>Add</p>
          </button>
        </div>
      </div>

      <div className='bg-white rounded-t-3xl h-[100vh] p-8'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg tracking-wider font-semibold'>October 2024</h2>
          <button onClick={() => setShowFilterModal(true)} className=' bg-slate-300'>
            <TfiFilter className='w-full h-full' />
          </button>
          
        </div>
        
        <div className="flex justify-center">
          <table className="min-w-full table-auto rounded-lg border-collapse  mt-6">
            <thead className=''>
              <tr className="">
                <th className="bg-neutral-200 rounded-md px-4 py-2">Name</th>
                <th className="bg-neutral-200 rounded-md px-4 py-2">Count</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 border-b-2">
                  <td className="p-4 text-center text-lg">{item.name}</td>
                  <td className="p-4 text-center text-lg">{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FilterModal showModal={showFilterModal} setShowModal={setShowFilterModal} />
      <AddModal showModal={showAddModal} setShowModal={setShowAddModal} />
    </div>
  )
}
