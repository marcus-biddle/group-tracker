import React, { useState } from 'react'
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { NavLink } from 'react-router-dom';

export const Header = () => {
  const [ isOpen, setIsOpen ] = useState(false);

  return (
    <div className=' flex items-center justify-between p-6 z-50'>
        <h2 className='text-lg font-mono'>GroupTracker.io</h2>
        <button onClick={() => setIsOpen(!isOpen)} className=' bg-slate-300'>
          {
            !isOpen ?
            <TfiMenu className=' w-full h-full' /> :
            <TfiClose className=' w-full h-full' />
          }
          
        </button>
        <div
        className={`fixed top-0 right-0 z-50 h-full w-full bg-gray-800 text-white p-6 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <TfiClose onClick={() => setIsOpen(false)} className=' fixed top-6 right-4 text-red-500 w-10 ' />
        <div className="flex flex-col space-y-4">
          <NavLink to={'/auth'} onClick={() => setIsOpen(false)}>Sign-In</NavLink>
          <NavLink to={'/'} onClick={() => setIsOpen(false)}>Options</NavLink>
        </div>
      </div>
    </div>
  )
}
