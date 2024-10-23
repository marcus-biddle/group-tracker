import React from 'react'

export const Introduction = ({ activityCount }) => {
  return (
    <div className='text-center text-gray-400 bg-neutral-800 rounded-md pt-16'>
        <p className=' font-light font-mono'>
            <strong className=' font-mono font-extrabold'>21</strong> players competing in
            <strong className=' font-mono font-extrabold'> {activityCount}</strong> activities.
        </p>
        <h1 className=' py-6 text-white'>Ready to compete?</h1>
    </div>
  )
}
