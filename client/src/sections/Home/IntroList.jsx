import React from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink } from 'react-router-dom';
import { TfiControlPlay } from "react-icons/tfi";

export const IntroList = ({ exerciseList }) => {
  return (
    <div className='py-6'>
        {/* <SearchBar /> */}
        <ul className=' space-y-6 p-6 bg-neutral-800 rounded-md h-screen'>
            {exerciseList.map((item, index) => (
                <NavLink to={`activities/${item.exercise_id}/${item.exercise_name}`} key={index} className=' border rounded-lg p-6 border-neutral-500 bg-neutral-500 text-white flex items-center justify-between shadow-lg'>
                    <li className={'pr-40 capitalize w-10'}>
                        {item.exercise_name}
                    </li>
                    <TfiControlPlay className=' w-6 h-6' />
                </NavLink>
            ))}
        </ul>
    </div>
  )
}
