import React from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink } from 'react-router-dom';
import { TfiControlPlay } from "react-icons/tfi";
import Text from '../../components/Text';

export const IntroList = ({ exerciseList }) => {
  return (
    <div className='py-6'>
        {/* <SearchBar /> */}
        <ul className=' space-y-6 p-6 h-screen'>
            {exerciseList.map((item, index) => (
                <NavLink to={`activities/${item.exercise_id}/${item.exercise_name}`} key={index} className=' border border-[#333333] text-[#FFFFFF] hover:text-[#B3B3B3] rounded-md p-6 bg-[#1C1C1C] flex items-center justify-between shadow-[rgba(0, 0, 0, 0.5)]'>
                    <li className={'pr-40 capitalize w-10 tracking-widest'}>
                        <Text size='large' color='primaryText'>{item.exercise_name}</Text>
                    </li>
                    <TfiControlPlay className=' w-6 h-6' />
                </NavLink>
            ))}
        </ul>
    </div>
  )
}
