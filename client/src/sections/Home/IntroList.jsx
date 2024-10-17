import React from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink } from 'react-router-dom';

export const IntroList = ({ exerciseList }) => {
  return (
    <div className='py-6'>
        <SearchBar />
        <ul className=' space-y-2 py-6'>
            {exerciseList.map((item, index) => (
                <li key={index} className=' border rounded-lg p-6 border-neutral-200'>
                    <NavLink to={`activities/${item.exercise_name}`} className={'pr-40 capitalize'}>
                        {item.exercise_name}
                    </NavLink>
                </li>
            ))}
        </ul>
    </div>
  )
}
