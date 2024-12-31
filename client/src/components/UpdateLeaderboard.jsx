import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LeaderboardAPI } from '../api/Leaderboard';
import { useNavigate } from 'react-router';
import { getUser } from '../helpers/authHelper';

export const UpdateLeaderboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [count, setCount] = useState(1);
    const [exercise, setExercise] = useState('pushup');

    const navigate = useNavigate();

    const handleSave = async () => {
        console.log(exercise, count, selectedDate)
        const user = await getUser();
        if (!user || !exercise || count < 0) return;
        console.log(user)
        // updateLeaderboard api
        try {
            const updated = await LeaderboardAPI.update(user.id, exercise, count);
            console.log('handleSave', updated);
            // if (updated === null) {
            //     navigate('/login');
            // }
        } catch {
            navigate('/login');
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
    <div className="">
        <div className="flex items-center justify-center space-x-4 mx-4">
            <div className="flex-1 text-left">
                <label htmlFor="exercise" className="block mb-1">
                Select Exercise
                </label>
                <select
                id="exercise"
                value={exercise}
                onChange={(e) => setExercise(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded p-2 shadow-md"
                >
                <option value={'pushup'}>Pushups</option>
                <option value={'pullup'}>Pullups</option>
                <option value={'running'}>Running</option>
                </select>
            </div>
                
            <div className="flex-1 text-left">
                <label htmlFor="date" className="block mb-1">
                Enter Date
                </label>
                <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded p-2 shadow-md"
                />
            </div>
        </div>

        <div className='m-6 '>
            <label htmlFor="count" className="block font-medium">
                How many Reps Did You Perform?
            </label>
            <div className='flex justify-center items-center gap-4'>
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
                    <div className="flex justify-center">
      {/* Decrement Button */}
      {/* <motion.button
        onClick={decrement}
        disabled={count <= 1}
        className={`px-4 py-2 rounded text-white ${
          count <= 1
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-red-500  active:scale-95"
        }`}
        whileTap={{ scale: 0.9 }}
      >
      </motion.button> */}

      {/* Animated Count */}
      

      {/* Increment Button */}
      {/* <motion.button
        onClick={increment}
        disabled={count >= 1000}
        className={`px-4 py-2 rounded text-white ${
          count >= 1000
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-500 active:scale-95"
        }`}
        whileTap={{ scale: 0.9 }}
      >
      </motion.button> */}
    </div>
            </div>
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
        className="flex-1 shadow-md text-[#00B2CC] border border-[#00B2CC] bg-transparent py-2 px-4 rounded-lg active:scale-95 active:bg-[#00B2CC] active:text-black  transition-transform duration-150"
      >
        Add
      </motion.button>
    </div>
    </>
  )
}

