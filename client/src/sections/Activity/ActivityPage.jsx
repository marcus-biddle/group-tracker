import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { retrieveAllExerciseLogsGroupedByUser, retrieveExerciseLog } from '../../api/exerciseApi';

const ActivityPage = () => {
  const [ exerciseLog, setExerciseLog ] = useState([]);

  const fetchExerciseLog = async () => {
      const data = await retrieveAllExerciseLogsGroupedByUser({ 
        month: date.month+1, 
        year: date.year, 
        day: -1 || date.day 
      });
      console.log('FIRST fetching log: ', data);
      setExerciseLog(data);
  }

  useEffect(() => {
    fetchExerciseLog();
  }, [])

  return (
    <div className="">
      <div className='space-y-4'>
        {exerciseLog.map((person, index) => (
          <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 }}
          // onClick={() => handleRecordClick(person.user_id, person.log_id)}
          className="flex justify-between bg-[#201726] text-[#918E9D] rounded-md px-4 py-3"
          >
            <span>{activeFilters.user === null ? index +1 : formatDate(person.date)}</span>
            {activeFilters.user === null ? <span>{person.fullname}</span> : null}
            <span>{activeFilters.user === null ? person.total_exercise_count : person.exercise_count}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPage;


