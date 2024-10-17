import React from 'react'

export const Introduction = ({ activityCount }) => {
  return (
    <div className='text-center'>
        <p className=' font-light text-gray-800 font-mono'>
            <strong className=' font-mono font-extrabold'>21</strong> players competing in
            <strong className=' font-mono font-extrabold'> {activityCount}</strong> activities.
        </p>

        <h1 className=' py-6'>Ready to compete?</h1>
    </div>
  )
}
