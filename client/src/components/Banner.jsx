import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { FaDumbbell, FaRunning, FaWalking } from 'react-icons/fa';

const messages = ["Track Your Progress.", "Compete with Friends!", "Reach New Heights!"];

const FadingTextLoop = () => {
    const [index, setIndex] = useState(0);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        setIndex((prev) => (prev + 1) % messages.length);
      }, 6000);
  
      return () => clearInterval(intervalId);
    }, []);
  
    return (
      <motion.div
        className="absolute top-10 text-center font-bold text-xl tracking-wide"
        key={messages[index]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {messages[index]}
      </motion.div>
    );
  };
  

const Banner = () => {
  const [exercise, setExercise] = useState('Pushups');
  const [counter, setCounter] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const controls = useAnimation();

  const exercises = [
    { name: 'Pushups', icon: <FaDumbbell /> },
    { name: 'Pullups', icon: <FaWalking /> },
    { name: 'Running', icon: <FaRunning /> }
  ];

  const leaderboard = [
    { name: 'Alice', reps: 300 },
    { name: 'Bob', reps: 250 },
    { name: 'Charlie', reps: 180 },
  ];

  // Cycle through exercises with a counter
  useEffect(() => {
    const intervalId = setInterval(() => {
      setExercise((prev) => {
        const nextExercise = exercises[(exercises.findIndex(e => e.name === prev) + 1) % exercises.length];
        return nextExercise.name;
      });
      setCounter((prev) => prev + Math.floor(Math.random() * 5 + 5));
    }, 6000);

    return () => clearInterval(intervalId);
  }, [exercises]);

  // Control animation to show new exercise
  useEffect(() => {
    controls.start({ scale: 1.15, transition: { duration: 0.5, yoyo: 1 } });
  }, [exercise, controls]);

  return (
    <div className="relative flex flex-col items-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white py-16 px-6 rounded-lg shadow-lg overflow-hidden max-w-sm md:max-w-lg mx-auto h-screen space-y-20">
      {/* <FadingTextLoop />

      <motion.div animate={controls} className="text-center mt-4">
        <div className="text-5xl md:text-7xl flex justify-center items-center">
          {exercises.find((e) => e.name === exercise).icon}
        </div>
        <h2 className="text-3xl font-semibold mt-4">{exercise}</h2>
        <p className="text-4xl font-extrabold mt-2 animate-pulse">{counter}</p>
        <span className="text-sm">Reps Tracked</span>
      </motion.div> */}

      
      <div className="mt-8 space-y-3 w-full text-center">
        <h3 className="text-2xl font-semibold">Top Performers</h3>
        {leaderboard.map((user, index) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex justify-between bg-opacity-50 bg-black/40 rounded-md px-6 py-3"
          >
            <span>{user.name}</span>
            <span>{user.reps} reps</span>
          </motion.div>
        ))}
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.15, backgroundColor: '#ffffff', color: '#4c51bf' }}
        whileTap={{ scale: 0.9 }}
        className="mt-8 bg-white text-purple-700 font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all ease-out"
      >
        Start Tracking
      </motion.button>
    </div>
  );
};

export default Banner;

