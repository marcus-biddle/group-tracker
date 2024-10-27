import React from 'react'
import Text from '../../components/Text'
import Header from '../../components/Header'
import { useNavigate } from 'react-router'
import { isAuthenticated } from '../../helpers/authHelper'

export const Introduction = ({ activityCount, playerCount }) => {
  const navigate = useNavigate();
  return (
    <div className='text-center  rounded-md pt-8'>
        <Text size='medium' color='mutedText'>
            <strong className=' font-mono font-extrabold text-[#FFFFFF]'>{playerCount}</strong> player{playerCount > 1 ? 's' : ''} competing in
            <strong className=' font-mono font-extrabold text-[#FFFFFF]'> {activityCount}</strong> activities.
        </Text>
        <div className='py-6'>
          <Header level="h1" color="primaryText">Create <span className='text-primary'>Move</span>ment</Header>
        </div>
        {!isAuthenticated() && <div className='mb-10'>
          <button onClick={() => navigate('/auth')} className='bg-[#E53981] w-[55%] border border-[#121212] rounded-md shadow-lg'>
            LOGIN
          </button>
        </div>}
    </div>
  )
}
