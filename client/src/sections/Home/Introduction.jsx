import React from 'react'
import Text from '../../components/Text'
import Header from '../../components/Header'

export const Introduction = ({ activityCount, playerCount }) => {
  return (
    <div className='text-center  rounded-md pt-16'>
        <Text size='medium' color='mutedText'>
            <strong className=' font-mono font-extrabold text-[#FFFFFF]'>{playerCount}</strong> player{playerCount > 1 ? 's' : ''} competing in
            <strong className=' font-mono font-extrabold text-[#FFFFFF]'> {activityCount}</strong> activities.
        </Text>
        <div className='py-6'>
          <Header level="h1" color="primaryText">Ready to compete?</Header>
        </div>
    </div>
  )
}
