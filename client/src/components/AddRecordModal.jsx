import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getUserId } from '../helpers/authHelper';
import { addExercise } from '../api/exerciseApi';

export const AddRecordModal = ({ isOpen, onClose, onCancel, onAddRecord, exerciseId }) => {
  if (!isOpen) return;

  const [exerciseCount, setExerciseCount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Set today's date

  const handleAddRecord = async() => {
    if (exerciseCount && date) {
      await addExercise({ exercise_count: Number(exerciseCount), date, user_id: getUserId(), exercise_id: exerciseId });
      onClose(); 
    }
  };

  return (
    isOpen && (
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-[#1E1623] rounded-lg shadow-lg p-6 w-80">
          <h2 className="text-xl font-bold text-[#CFCDDD] mb-4">Add Record</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#918E9D]">Exercise Count</label>
            <input
              type="number"
              value={exerciseCount}
              onChange={(e) => setExerciseCount(e.target.value)}
              className="mt-1 block w-full border border-[#322a37] bg-[#120D18] text-[#CFCDDD] rounded-md shadow-sm p-2"
              placeholder="Enter count"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-[#918E9D]">Date</label>
            <input
              type="date"
              value={date}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 block w-full border border-[#322a37] bg-[#120D18] text-[#CFCDDD] rounded-md shadow-sm p-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="bg-[#322a37] text-[#CFCDDD] rounded-md px-4 py-2 transition duration-200 hover:bg-[#201726]"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRecord}
              className="bg-[#5C4D7D] text-white rounded-md px-4 py-2 transition duration-200 hover:bg-[#4A3C67]"
            >
              Add
            </button>
          </div>
        </div>
      </motion.div>
    )
  );
};

