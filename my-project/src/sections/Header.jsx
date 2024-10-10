import React from 'react'
import { TfiMenu } from "react-icons/tfi";

export const Header = () => {
  return (
    <div className=' flex items-center justify-between p-6 z-50'>
        <h2 className='text-lg font-mono'>GroupTracker.io</h2>
        <TfiMenu className=' w-8 h-8' />
    </div>
  )
}
