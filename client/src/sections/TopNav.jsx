import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../helpers/authHelper';
import { GiEcology } from "react-icons/gi";
import { SlidingMenu } from '../components/SlidingMenu';
import { GoPersonAdd, GoPlus, GoCalendar, GoGraph } from "react-icons/go";
import { retrieveUsers } from '../api/playersApi';
import { retrieveExercises } from '../api/exerciseApi';

const subNavGuide = [
  'Activity', 'Players',
]

export const TopNav = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const logout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
  };

  const [ exerciseList, setExerciseList ] = useState([]);
  const [ playerList, setPlayerList ] = useState([]);

    const fetchExercises = async () => {
        try {
            const data = await retrieveExercises();
            console.log('Successfully retrieved exercises:', data);
            setExerciseList(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        }
    }

    const fetchPlayerList = async () => {
      try {
        const data = await retrieveUsers();
        console.log('Successfully retrieved players:', data);
        setPlayerList(data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    }

    useEffect(() => {
        fetchExercises();
        fetchPlayerList();
    }, []);

  return (
    <>
    <div className=' flex items-center justify-between py-4 px-8 z-50 text-[#B3B3B3] bg-[#19141E] shadow-lg'>
      <div className=' flex justify-center items-center'>
        <button className='bg-transparent' onClick={goHome}>
          <GiEcology className='w-full h-full text-[#00B2CC] scale-150' />
        </button>
      </div>
      <div className=' flex justify-center items-center'>
        <span>Date</span>
        <button onClick={() => setShowCalendar(true)} className='text-[#00B2CC] bg-[#322a37] bg-opacity-75'>
          <GoCalendar className='w-full h-full scale-150' />
        </button>
      </div>
        
      {/* <Button size='medium' onClick={() => setIsOpen(!isOpen)}>
        {
          !isOpen ?
          <TfiMenu className=' w-full h-full' /> :
          <TfiClose className=' w-full h-full' />
        }
        
      </Button> */}

      {/* Menu */}
      {/* <div
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
        
      </div> */}
      {/* <SlidingMenu /> */}
    </div>
    <div className='flex w-full justify-evenly'>
      {subNavGuide.map((category) => (
        <div key={category} className=' w-full flex items-center justify-evenly py-4 px-8 z-50 text-[#B3B3B3] bg-[#1d1723] shadow-lg'>{category}</div>
      ))}
    </div>
    </>
    
  )
}
