import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { GiEcology } from "react-icons/gi";
import { retrieveUsers } from '../api/playersApi';
import { retrieveExercises } from '../api/exerciseApi';
import Calendar from '../components/Calendar';
import supabase from '../api/supabase';
import { getUser } from '../helpers/authHelper';

const subNavGuide = [
  'activity', 'profile'
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

  const [loggedIn, setLoggedIn] = useState(false);
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setLoggedIn(false);
  }

  const goHome = () => navigate("/");

  const [ exerciseList, setExerciseList ] = useState([]);
  const [ playerList, setPlayerList ] = useState([]);
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

  const fetchUserDetails = async () => {
    const user = await getUser();
    
    if (user) {
      console.log('Authenticated User:', user);
    } else {
      console.log('No user authenticated or an error occurred.', user);
    }
  
    setLoggedIn(user === null ? false : true)
  };

  useEffect(() => {
      fetchUserDetails();
  }, []);

  return (
      <div className=' flex justify-between bg-[#121212] rounded-b-2xl shadow-lg'>
        <div className='flex justify-between py-2'>
          <div className=''>
            <button className='bg-transparent text-[#00B2CC] h-full w-20 active:scale-90 transition-transform duration-150' onClick={goHome}>
              <GiEcology className='w-full h-full scale-90' />
            </button>
          </div>
        </div>
        
        <div className='flex gap-2 px-2'>
          {subNavGuide.map((category) => (
            <NavLink to={`/${category}`} key={category} className={({ isActive }) =>
              `${isActive || (pathname === null && category === 'activity') ? 'visited:text-[#EFEDFD] font-bold ' 
                : 'text-[#7C7986]'} 
              bg-transparent capitalize flex items-center p-4 tracking-wider`
            }>{category}</NavLink>
          ))}
          <NavLink to={`${loggedIn ? '/activity' : '/login'}`}
          onClick={() => signOut()}
           className={({ isActive }) =>
              `${isActive || (pathname === '/login') ? 'visited:text-[#EFEDFD] font-bold ' 
                : 'text-[#7C7986]'} 
              bg-transparent capitalize flex items-center p-4 tracking-wider`
            }>{loggedIn ? 'Logout' : 'Login'}</NavLink>
        </div>
    </div>
  )
}
