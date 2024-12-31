import React, { useEffect, useState } from 'react'
import { addExercise } from '../../api/exerciseApi';
import { getUserId } from '../../helpers/authHelper';
import { useNavigate } from 'react-router';
import { motion, useMotionValue, animate } from 'framer-motion'
import { FiPlus, FiMinus } from "react-icons/fi";

export const LogPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [count, setCount] = useState(1);
    const [exercise, setExercise] = useState(1);
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

      const increment = () => {
        if (count < 1000) setCount((prev) => prev + 1);
      };
    
      const decrement = () => {
        if (count > 1) setCount((prev) => prev - 1);
      };

  return (
    <>
    <div className="flex flex-col gap-6">
        <h2 className="text-xl">
          Please fill out the form below to update your count or import your previous records.
        </h2>
          <div className='text-left'>
            <label htmlFor="exercise" className="block font-medium mb-2 opacity-30">
              Select Exercise
            </label>
            <select
              id="exercise"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="block w-full px-4 py-2 rounded-md text-white bg-[#1E1B22] caret-transparent"
            >
              <option value={1}>Pushups</option>
              <option value={2}>Pullups</option>
              <option value={3}>Running</option>
            </select>
          </div>
        
        <div className='text-left'>
            <label htmlFor="date" className="block font-medium mb-2 opacity-30">
                Enter Date
            </label>
            <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="block w-full px-4 py-2 rounded-md text-white bg-[#1E1B22] caret-transparent"
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
              <div className="flex justify-center gap-8 my-10">
      {/* Decrement Button */}
      <motion.button
        onClick={decrement}
        disabled={count <= 1}
        className={`px-4 py-2 rounded text-white ${
          count <= 1
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-red-500  active:scale-95"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        <FiMinus className=' w-full h-full' />
      </motion.button>

      {/* Animated Count */}
      <motion.div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.3 }}
      >
        {count.toFixed(0)}
      </motion.div>

      {/* Increment Button */}
      <motion.button
        onClick={increment}
        disabled={count >= 1000}
        className={`px-4 py-2 rounded text-white ${
          count >= 1000
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-500 active:scale-95"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        <FiPlus className='w-full h-full' />
      </motion.button>
    </div>
              
            </div>
    </div>




    
    <div className="flex gap-4 w-full max-w-4xl mx-auto px-4">
    <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 50 }}
        onClick={() => navigate('import')}
        className="w-[30%] text-black bg-[#00B2CC] py-2 px-4 rounded-lg active:scale-95 active:bg-black active:text-[#00B2CC] hover:bg-black hover:text-[#00B2CC] shadow-md transition-transform duration-150"
      >
        Import
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 50 }}
        onClick={() => handleSave()}
        className="flex-1 text-[#00B2CC] border border-[#00B2CC] bg-transparent py-2 px-4 rounded-lg active:scale-95 active:bg-[#00B2CC] active:text-black  transition-transform duration-150"
      >
        Add
      </motion.button>
    </div>
    </>
  )
}
