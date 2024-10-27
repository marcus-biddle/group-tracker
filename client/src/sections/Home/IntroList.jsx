import React from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink } from 'react-router-dom';
import { TfiControlPlay } from "react-icons/tfi";
import Text from '../../components/Text';
import Header from '../../components/Header';
import Slider from "react-slick";

export const IntroList = ({ exerciseList }) => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1.0, // Show one full card and half of the next one
        slidesToScroll: 1,
        centerMode: true, // Enables the center mode for a "peek" effect
        centerPadding: "30px", // Adjust padding to control how much of the next card shows
      };

  return (
    <div className='py-6'>
        {/* <SearchBar /> */}
        <Slider {...settings}>
            {exerciseList.map((item, index) => (
                <div key={index} className="relative max-w-[95%] mx-auto bg-secondaryMenu rounded-lg p-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow"></div>
                    <div className="relative bg-secondaryMenu capitalize rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                        <Text size='large' color='primaryText' className=' tracking-wider uppercase items-center flex justify-center p-4'>{item.exercise_name}</Text>
                        <NavLink to={`activities/${item.exercise_id}/${item.exercise_name}`}>
                            <button 
                            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primaryHover transition-colors duration-200 ease-in-out"
                            >
                                Track Progress
                            </button>
                        </NavLink>
                    </div>
                </div>
            ))}
        </Slider>
        <ul className=' space-y-16 mx-12 mt-20'>
            {exerciseList.map((item, index) => (
                <div key={index} className="relative max-w-sm mx-auto bg-secondaryMenu rounded-lg p-1 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary animate-spin-slow"></div>
                    <div className="relative bg-secondaryMenu capitalize rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                        <Text size='large' color='primaryText' className=' tracking-wider uppercase items-center flex justify-center p-4'>{item.exercise_name}</Text>
                        <NavLink to={`activities/${item.exercise_id}/${item.exercise_name}`}>
                            <button 
                            className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primaryHover transition-colors duration-200 ease-in-out"
                            >
                                Track Progress
                            </button>
                        </NavLink>
                    </div>
                </div>
            ))}
        </ul>
    </div>
  )
}
