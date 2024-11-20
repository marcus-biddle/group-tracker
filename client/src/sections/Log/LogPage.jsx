import React, { useState } from 'react'
import { addExercise } from '../../api/exerciseApi';
import { getUserId } from '../../helpers/authHelper';
import { useNavigate } from 'react-router';

export const LogPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [count, setCount] = useState("");
    const [exercise, setExercise] = useState(1);
    const [cautionModal, openCautionModal] = useState(false);
    const navigate = useNavigate();

    const handleSave = async () => {
        console.log(exercise, count, selectedDate)
        if (!exercise || count === '' || count < 0) {
            setCount('');
          setSelectedDate('');
          alert('Please fill in all fields with valid data.');
          
          return;
        }
    
        try {
            await addExercise({ exercise_count: count, date: selectedDate, user_id: getUserId(), exercise_id: exercise });
            setCount('');
            setSelectedDate('');
            alert('Exercise count logged successfully!');
        } catch {
            console.log('please sign in')
            openCautionModal(true);
        }
        
      };

  return (
    <>
    <div className="min-h-[550px] flex flex-col justify-evenly items-center py-8 px-6 z-10">
        <h1 className="text-2xl font-bold text-[#C1BFCD] text-left w-full">
          Log Exercise Count
        </h1>
        <div className="relative bg-[#120D18] shadow-md w-full p-4 rounded-md text-[#7C7986] bg-opacity-75">
          <label htmlFor="exercise" className="block font-medium mb-2">
            Select Exercise
          </label>
          <select
            id="exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="block min-w-32 px-4 py-2 rounded-md text-[#00B2CC] bg-[#322a37]"
          >
            <option value={1}>Pushups</option>
            <option value={2}>Pullups</option>
            <option value={3}>Running</option>
          </select>
        </div>
        <div className="relative bg-[#120D18] shadow-md w-full p-4 rounded-md text-[#7C7986] bg-opacity-75">
          <label htmlFor="count" className="block font-medium mb-2">
            Enter Count
          </label>
          <input
            id="count"
            type="number"
            value={count}
            onChange={(e) =>
                setCount(e.target.value ? parseInt(e.target.value, 10) : "")
              }
            min={0}
            className="block px-4 py-2 rounded-md text-[#00B2CC] bg-[#322a37]"
            placeholder="Enter the count"
          />
        </div>
        <div className="relative bg-[#120D18] shadow-md w-full p-4 rounded-md text-[#7C7986] bg-opacity-75">
            <label htmlFor="date" className="block font-medium mb-2">
                Enter Date
            </label>
            <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="block px-4 py-2 rounded-md text-[#00B2CC] bg-[#322a37]"
            />
        </div>
        <button
          onClick={() => handleSave()}
          className="w-full text-[#00B2CC] border border-[#00B2CC] bg-transparent py-2 px-4 rounded-lg transition"
        >
          Log Count
        </button>
        <button
          onClick={() =>navigate('import')}
          className="w-full text-[#00B2CC] border border-black bg-black py-2 px-4 rounded-lg transition"
        >
          Import Logs
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
