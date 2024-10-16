import React from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink } from 'react-router-dom';

const list=['pushups', 'pullups', 'running'];

export const IntroList = () => {
  return (
    <div className='py-6'>
        <SearchBar />
        <ul className=' space-y-2 py-6'>
            {list.map((item, index) => (
                <li key={index} className=' border rounded-lg p-6 border-neutral-200'>
                    <NavLink to={`activities/${item}`} className={'pr-40'}>
                        {item}
                    </NavLink>
                </li>
            ))}
        </ul>
    </div>
  )
}
