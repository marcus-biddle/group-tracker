import React from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink } from 'react-router-dom';
import { TfiControlPlay } from "react-icons/tfi";

export const IntroList = ({ exerciseList }) => {
  return (
    <div className='py-6'>
        {/* <SearchBar /> */}
        <ul className=' space-y-6 p-6 h-screen'>
            {exerciseList.map((item, index) => (
                <NavLink to={`activities/${item.exercise_id}/${item.exercise_name}`} key={index} className=' border rounded-md p-6 border-rose-600 bg-rose-500 text-neutral-800 flex items-center justify-between shadow-md'>
                    <li className={'pr-40 capitalize w-10 tracking-widest'}>
                        {item.exercise_name}
                    </li>
                    <TfiControlPlay className=' w-6 h-6' />
                </NavLink>
            ))}
        </ul>
    </div>
  )
}
