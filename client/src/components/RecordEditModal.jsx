import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { deleteExercise, updateExercise } from '../api/exerciseApi';

export const RecordEditModal = ({ isOpen, onClose, onCancel, onSave, record }) => {
  if (!isOpen) return;

  console.log('modal record:', record, record.exercise_count);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format to "yyyy-MM-dd" for input[type="date"]
    return date.toISOString().split('T')[0];
  };

  const [date, setDate] = useState(formatDate(record?.date) || '');
  const [count, setCount] = useState(record?.exercise_count || '');

  // Reset form when modal is opened
  // useEffect(() => {
  //   if (isOpen) {
  //     setDate(record?.date || '');
  //     setCount(record?.count || '');
  //   }
  // }, [isOpen, record]);

  const handleSave = async() => {
    console.log({ ...record, date, exercise_count: count });
    updateExercise({
      log_id: record.log_id, 
      date: date, 
      exercise_count: count
    })
    onClose();
  };

  const handleDelete = async() => {
    deleteExercise({
      log_id: record.log_id
    })
    onClose();
  };

  return (
    <>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0.8 }} 
            className="bg-[#19121D] text-[#CFCDDD] p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-2xl font-semibold mb-4">Edit Record</h2>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Date</label>
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-md bg-[#322a37] border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Count</label>
              <input
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full p-2 rounded-md bg-[#322a37] border border-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                  onClick={handleDelete} 
                  className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition text-white"
                >
                Delete
              </button>
              <button 
                onClick={onCancel} 
                className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition text-white"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
