import React from 'react'
import Text from '../../components/Text'
import Header from '../../components/Header'
import { useNavigate } from 'react-router'
import { isAuthenticated } from '../../helpers/authHelper'
import { FaArrowRight } from "react-icons/fa";
import { motion } from 'framer-motion'

export const Introduction = ({ activityCount, playerCount }) => {
  const navigate = useNavigate();
  return (
    <div className='text-center  rounded-md pt-8'>
        <Text size='medium' color='mutedText'>
            <strong className=' font-mono font-extrabold text-[#FFFFFF]'>{playerCount}</strong> particpant{playerCount > 1 ? 's' : ''} competing in
            <strong className=' font-mono font-extrabold text-[#FFFFFF]'> {activityCount}</strong> activities.
        </Text>
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
