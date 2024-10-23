import React, { useState } from 'react'
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../helpers/authHelper';

export const Header = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const logout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
  };

  return (
    <div className=' flex items-center justify-between p-6 z-50'>
      <button className='bg-transparent p-0 focus:outline-none' onClick={goHome}>
        <h2 className='text-lg font-mono text-black'>GroupTracker.io</h2>
      </button>
        
        <button onClick={() => setIsOpen(!isOpen)} className=' bg-rose-500 border border-rose-600 rounded-md'>
          {
            !isOpen ?
            <TfiMenu className=' w-full h-full text-black' /> :
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
        <div className='relative space-y-10'>
          <div className="flex flex-col space-y-4">
            {!isAuthenticated() && <NavLink to={'/auth'} onClick={() => setIsOpen(false)}>Sign-In</NavLink>}
            <NavLink to={'/'} onClick={() => setIsOpen(false)}>Options</NavLink>
          </div>
          <div className=' w-full flex justify-center'>
            {isAuthenticated() && 
            <button onClick={logout} className=' w-full uppercase tracking-wider text-neutral-400'>Logout</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
