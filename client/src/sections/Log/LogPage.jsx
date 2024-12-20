import React, { useEffect, useState } from 'react'
import { addExercise } from '../../api/exerciseApi';
import { getUserId } from '../../helpers/authHelper';
import { useNavigate } from 'react-router';
import { motion, useMotionValue, animate } from 'framer-motion'

export const LogPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [count, setCount] = useState(1);
    const [exercise, setExercise] = useState(1);
    const [cautionModal, openCautionModal] = useState(false);
    // const [value, setValue] = useState(1);
    const navigate = useNavigate();

    const handleSave = async () => {
        console.log(exercise, count, selectedDate)
        if (!exercise || count === '' || count < 0) {
          setCount(1);
          setSelectedDate('');
          alert('Please fill in all fields with valid data.');
          
          return;
        }
    
        try {
            await addExercise({ exercise_count: count, date: selectedDate, user_id: getUserId(), exercise_id: exercise });
            setCount(1);
            setSelectedDate('');
            alert('Exercise count logged successfully!');
        } catch {
            console.log('please sign in')
            openCautionModal(true);
        }
        
      };

  return (
    <>
    <div className=" flex flex-col gap-2 px-8 py-12 text-[#efedfdaa]">
        {/* <h1 className="text-2xl font-bold text-[#C1BFCD] text-left w-full">
          Log Exercise Count
        </h1> */}
          <div className=''>
            <label htmlFor="exercise" className="block font-medium mb-2">
              Select Exercise
            </label>
            <select
              id="exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="block w-full px-4 py-2 rounded-md text-[#00B2CC] bg-[#1E1B22] caret-transparent"
            >
              <option value={1}>Pushups</option>
              <option value={2}>Pullups</option>
              <option value={3}>Running</option>
            </select>
          </div>
          <div>
            


            {/* <input
              id="count"
              type="number"
              value={count}
              onChange={(e) =>
                  setCount(e.target.value ? parseInt(e.target.value, 10) : "")
                }
              min={0}
              className="block w-full px-4 py-2 rounded-md text-[#00B2CC] bg-[#1E1B22] caret-transparent"
              placeholder="Enter count"
            /> */}
          </div>
        
        <div className=''>
            <label htmlFor="date" className="block font-medium mb-2">
                Enter Date
            </label>
            <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="block w-full px-4 py-2 rounded-md text-[#00B2CC] bg-[#1E1B22] caret-transparent"
            />
        </div>

        <label htmlFor="count" className="block font-medium mb-2">
              How many Reps Did You Perform?
            </label>
            <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
              <motion.input
                type="range"
                name="range"
                min="1"
                max="1000"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                style={{ cursor: 'pointer', width: '100%',  }}
              />
              <motion.div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  
                }}
              >
                {count.toFixed(0)}
              </motion.div>
            </div>
    </div>




    
    <div className="flex gap-4 w-full max-w-4xl mx-auto px-4">
    <button
        onClick={() => navigate('import')}
        className="w-[30%] text-black bg-[#00B2CC] py-2 px-4 rounded-lg active:scale-95 active:bg-black active:text-[#00B2CC] hover:bg-black hover:text-[#00B2CC] shadow-md transition-transform duration-150"
      >
        Import
      </button>
      <button
        onClick={() => handleSave()}
        className="flex-1 text-[#00B2CC] border border-[#00B2CC] bg-transparent py-2 px-4 rounded-lg active:scale-95 active:bg-[#00B2CC] active:text-black hover:bg-[#00B2CC] hover:text-black transition-transform duration-150"
      >
        Add
      </button>

      
    </div>

    {cautionModal && <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
      <div className="bg-teal-100 p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-2xl font-semibold text-teal-800 mb-4">Caution!</h2>
        <p className="text-slate-900 mb-4">
          You cannot add a log without signing in first. Would you like to go sign in?
        </p>
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/auth')}
            className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600"
          >
            Yes, Proceed
          </button>
          <button
            onClick={null}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>}
    </>
  )
}
