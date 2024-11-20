import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { isAuthenticated } from '../helpers/authHelper';
import { GiEcology } from "react-icons/gi";
import { SlidingMenu } from '../components/SlidingMenu';
import { GoPersonAdd, GoPlus, GoCalendar, GoGraph } from "react-icons/go";
import { retrieveUsers } from '../api/playersApi';
import { retrieveExercises } from '../api/exerciseApi';
import { useHeaderData } from '../context/HeaderDataContext';
import Calendar from '../components/Calendar';

const subNavGuide = [
  'activity', 'log', 'profile'
]

export const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];

export const TopNav = () => {
  const [ isOpen, setIsOpen ] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.split('/')[1] || null;

  const goHome = () => navigate("/");
  const logout = () => {
    localStorage.removeItem('token');
    setIsOpen(false);
  };

  const [ exerciseList, setExerciseList ] = useState([]);
  const [ playerList, setPlayerList ] = useState([]);
  const { headerData, setHeaderData } = useHeaderData();
  const [ showCalendar, setShowCalendar ] = useState(false);
  const [ date, setDate ] = useState({
    day: -1,
    month: new Date().getMonth()+1,
    year: new Date().getFullYear()
  })

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

    // useEffect(() => {
    //     fetchExercises();
    //     fetchPlayerList();
    // }, []);

  return (
    <>
    <div className=' flex items-center justify-between py-4 px-8 z-50 text-[#B3B3B3] bg-[#19141E] shadow-lg'>
      <div className=' flex justify-center items-center'>
        <button className='bg-transparent' onClick={goHome}>
          <GiEcology className='w-full h-full text-[#00B2CC] scale-150' />
        </button>
      </div>
      <div className=' flex justify-center items-center'>
        <span className='mx-2'>{months[headerData.date.month-1].name} {headerData.date.day === -1 ? '' : `${headerData.date.day},`} {headerData.date.year}</span>
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
        <NavLink to={`/${category}`} key={category} className={`${category === pathname || pathname === null && category === 'activity' ? 'border-b-2' : ''} w-full capitalize flex items-center justify-evenly py-4 px-8 z-50 text-[#B3B3B3] visited:text-[#B3B3B3] bg-[#1d1723] shadow-lg`}>{category}</NavLink>
      ))}
    </div>

    {showCalendar && <div className=' absolute top-0 h-screen flex justify-center items-center w-full px-6 bg-black bg-opacity-50'>
        <Calendar setShowCalendar={setShowCalendar} />
      </div>}
    </>
    
  )
}
