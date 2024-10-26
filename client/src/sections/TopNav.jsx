import React, { useState } from 'react'
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../helpers/authHelper';
import Button from '../components/Button';
import Header from '../components/Header';

export const TopNav = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const logout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
  };

  return (
    <div className=' flex items-center justify-between p-6 z-50 text-[#B3B3B3]'>
      <button className='bg-transparent p-0 focus:outline-none' onClick={goHome}>
        <h2 className='text-lg font-mono '>GroupTracker.io</h2>
      </button>
        
      <Button size='medium' onClick={() => setIsOpen(!isOpen)}>
        {
          !isOpen ?
          <TfiMenu className=' w-full h-full' /> :
          <TfiClose className=' w-full h-full' />
        }
        
      </Button>

      {/* Menu */}
      <div
      className={`fixed top-0 right-0 z-50 h-full w-full bg-secondaryMenu p-10 transition-transform duration-300 ease-in-out flex flex-col items-start space-y-6 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      >
        <Header level="h3" color='mutedText'>
          My Dashboard
        </Header>
        <TfiClose onClick={() => setIsOpen(false)} className=' fixed top-0 right-6 text-red-500 w-6 h-6 ' />

        {!isAuthenticated() && <NavLink to={'/auth'} onClick={() => setIsOpen(false)}>Sign-In</NavLink>}
        <NavLink to={'/'} onClick={() => setIsOpen(false)}>Options</NavLink>
        
        <div className=' w-full flex justify-center'>
          {isAuthenticated() && 
          <button onClick={logout} className=' w-full uppercase tracking-wider text-neutral-400'>Logout</button>
          }
        </div>
        
      </div>
    </div>
  )
}
