import React, { useEffect, useState } from 'react'
import Text from '../../components/Text'
import Header from '../../components/Header'
import { useNavigate } from 'react-router'
import { isAuthenticated } from '../../helpers/authHelper'
import { FaArrowRight } from "react-icons/fa";
import { AnimatePresence, motion } from 'framer-motion'

export const Introduction = ({ activityCount, playerCount }) => {
  const navigate = useNavigate();
  // const [count, setCount] = useState(0);

    // useEffect(() => {
    //     if (count < 10) {
    //         const intervalId = setInterval(() => {
    //             setCount((prevCount) => prevCount + 1);
    //         }, 1500); 

    //         return () => clearInterval(intervalId); // Cleanup interval on component unmount
    //     }
    // }, [count]);

  return (
    <div className='text-center rounded-md pt-8'>
      <div className='flex justify-evenly mb-6'>
      <div className="flex flex-col items-center">
            <motion.div
            key={playerCount}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="bg-[#17101B] text-white rounded-lg p-2 w-10 flex justify-center items-center text-2xl font-bold shadow-md"
            >
                {playerCount}{' '}
            </motion.div>
            <p className=' text-[#C1BFCD] text-2xl px-2'>Participants</p>
      </div>
      <div className="flex flex-col items-center">
            <motion.div
            key={activityCount}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="bg-[#17101B] text-white rounded-lg p-2 w-10 flex justify-center items-center text-2xl font-bold shadow-md"
            >
                {activityCount}
            </motion.div>
            <p className=' text-[#C1BFCD] text-2xl px-2'>Activities</p>
      </div>
      </div>
        <div className='py-6'>
          <Header level="h1" color="primaryText">Create <span className='text-[#00B2CC]'>Move</span>ment</Header>
        </div>
        {!isAuthenticated() && <div className='mb-10 flex justify-center'>
          {/* <button onClick={() => navigate('/auth')} className='bg-[#E53981] w-[55%] border border-[#121212] rounded-md shadow-lg'>
            LOGIN
          </button> */}
          <div className=' bg-[#1E1623] flex justify-between items-center rounded-full w-64 p-1 shadow-lg'>
            <p className=' text-[#C1BFCD] font-semibold px-2'>Sign up here</p>
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/auth')}
              className="transition-all ease-out bg-[#120D18] rounded-full"
            >
              <FaArrowRight className='bg-[#1E1623] text-[#00B2CC]' />
            </motion.button>
          </div>
        </div>}
    </div>
  )
}
