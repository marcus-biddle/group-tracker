import React from 'react';
import { motion } from 'framer-motion';

const ActivityPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold">Activity Tracker</h1>
        <p className="text-lg text-gray-400">Log your reps and compete with friends!</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {['Push Ups', 'Pull Ups', 'Running'].map((activity, index) => (
          <motion.div
            key={index}
            className="bg-gray-700 rounded-lg p-4 transition-transform transform hover:scale-105 flex flex-col items-center justify-between"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <h2 className="text-2xl mb-2">{activity}</h2>
            <p className="text-xl mb-4">Reps: 0</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md transition-colors hover:bg-blue-600">
              Log Now
            </button>
          </motion.div>
        ))}
      </div>

      <section>
        <h2 className="text-3xl text-center mb-4">Leaderboard</h2>
        <motion.table 
          className="min-w-full border-collapse border border-gray-600"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          <thead>
            <tr className="bg-gray-700 text-gray-200">
              <th className="border border-gray-600 p-3">Name</th>
              <th className="border border-gray-600 p-3">Push Ups</th>
              <th className="border border-gray-600 p-3">Pull Ups</th>
              <th className="border border-gray-600 p-3">Running</th>
            </tr>
          </thead>
          <tbody>
            {['User 1', 'User 2', 'User 3'].map((user, index) => (
              <tr key={index} className={`bg-gray-${index % 2 === 0 ? '600' : '500'}`}>
                <td className="border border-gray-500 p-3">{user}</td>
                <td className="border border-gray-500 p-3">50</td>
                <td className="border border-gray-500 p-3">20</td>
                <td className="border border-gray-500 p-3">5 km</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      </section>
    </div>
  );
};

export default ActivityPage;


