import React, { useState } from 'react'
import { SearchBar } from '../../components/SearchBar';
import { NavLink, useNavigate } from 'react-router-dom';
import { TfiControlPlay } from "react-icons/tfi";
import Text from '../../components/Text';
import Header from '../../components/Header';
import Slider from "react-slick";
import { motion, useAnimation } from 'framer-motion';
import { FaArrowRight } from "react-icons/fa";

const animeQuotes = [
    { quote: '"The only way to truly escape the mundane…is to constantly evolve."', author: 'Saitama'},
    { quote: '"Strength isn’t something you earn or inherit. You stake your life on it.”', author: 'Erwin'},
    { quote: '"Surpass Your Limits. Right Here. Right Now."', author: 'Yami' }
]

export const IntroList = ({ exerciseList }) => {
    const navigate = useNavigate();
    const [ activeButton , setActiveButton ] = useState('pushups');

    const activityIndex = exerciseList.findIndex(e => e.exercise_name === activeButton) || 0;
    console.log(activityIndex, 'ACTINDEX')
    const randomQuote = animeQuotes[activityIndex === -1 ? 0 : activityIndex];
    const currentActivity = exerciseList[activityIndex] || {exercise_id: 1, exercise_name: 'pushups'};
    console.log(currentActivity)
    const currentActivityLink = `/activities/${currentActivity.exercise_id}/${currentActivity.exercise_name}`;
    console.log(activeButton, exerciseList)
    // const settings = {
    //     dots: true,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 1.0, // Show one full card and half of the next one
    //     slidesToScroll: 1,
    //     centerMode: true, // Enables the center mode for a "peek" effect
    //     centerPadding: "30px", // Adjust padding to control how much of the next card shows
    //   };

  return (
    <div className='py-6'>
        {/* <SearchBar /> */}
        {/* <Slider {...settings}>
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
        </Slider> */}
        <div className=' flex justify-evenly mb-10'>
            {exerciseList.map((exercise, index) => (
                <div key={index} onClick={() => setActiveButton(exercise.exercise_name)}>
                    <motion.button
                        key={exercise.exercise_name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        // transition={{ delay: index * 0.2 }}
                        whileTap={{ scale: 0.5 }}
                        className="transition-all ease-out bg-[#322a37] bg-opacity-75 text-[#CFCDDD] inline-block px-6 py-4 rounded-md font-semibold tracking-wide capitalize shadow-md"
                        >
                            <div className=' '>{exercise.exercise_name}</div>
                    </motion.button>
                </div>
                    
                ))}
            
            {/* <motion.button
            onClick={() => setActiveButton('pullups')}
            whileHover={{ scale: 1.15, backgroundColor: '#ffffff', color: '#4c51bf' }}
            whileTap={{ scale: 0.8 }}
            className="transition-all ease-out bg-[#322a37] bg-opacity-75 text-[#CFCDDD] inline-block px-6 py-4 rounded-md font-semibold tracking-wide capitalize shadow-md"
            >
                <div className=' '>pullups</div>
            </motion.button>
            <motion.button
            onClick={() => setActiveButton('running')}
            whileHover={{ scale: 1.15, backgroundColor: '#ffffff', color: '#4c51bf' }}
            whileTap={{ scale: 0.8 }}
            className="transition-all ease-out bg-[#322a37] bg-opacity-75 text-[#CFCDDD] inline-block px-6 py-4 rounded-md font-semibold tracking-wide capitalize shadow-md"
            >
                <div className=' '>running</div>
            </motion.button> */}
        </div>
        <div className="flex justify-center items-center">
      <motion.div
        // onClick={toggleExpand}
        key={activeButton}
        initial={{ width: 50, height: 50, opacity: 0, x: -100, y: -100 }}
        animate={{
          width: activeButton !== '' ? "100%" : 50,
          height: activeButton !== '' ? "100%" : 50,
          opacity: activeButton !== '' ? 1 : 0,
          x: activeButton !== '' ? 0 : -20,
          y: activeButton !== '' ? 0 : -20
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative bg-[#291B34] rounded-md shadow-lg overflow-hidden cursor-pointer mx-6"
      >
        {activeButton !== '' && (
            <div>
                <div onClick={() => setActiveButton('')} className='absolute px-2 pb-1 top-2 right-4 border border-[#00B2CC] text-[#00B2CC] font-semibold rounded-md text-2xl flex justify-center items-center'>
                    &times;
                </div>
                <div className="mx-6 mt-14 mb-6 rounded-md p-8 bg-[#120D18] shadow-md">
                    <div className='flex justify-between items-center'>
                        <h1 className="text-4xl font-semibold text-[#EFEDFD] capitalize">{activeButton}</h1>
                        <button onClick={() => navigate(currentActivityLink)} className='h-full text-[#EFEDFD] bg-[#19121D] shadow-lg'>
                            <FaArrowRight />
                        </button>
                    </div>
                    
                    <p className="mt-2 text-[#7C7986] font-semibold text-md">
                        {randomQuote.quote} <br />-{randomQuote.author}
                    </p>
                    <p className='text-[#7C7986] my-4 font-bold text-xl'>Top Players</p>
                    <div className=' space-y-4'>
                        <motion.div
                            key={'a'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 3 * 0.2 }}
                            className="flex justify-between bg-[#19121D] text-[#918E9D] rounded-md px-6 py-3"
                        >
                            <span>Winner Winner</span>
                            <span>1000 reps</span>
                        </motion.div>
                        <motion.div
                            key={'b'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 4 * 0.2 }}
                            className="flex justify-between bg-[#19121D] text-[#918E9D] rounded-md px-6 py-3"
                        >
                            <span>Winner Winner</span>
                            <span>1000 reps</span>
                        </motion.div>
                        <motion.div
                            key={'c'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 5 * 0.2 }}
                            className="flex justify-between bg-[#19121D] text-[#918E9D] rounded-md px-6 py-3"
                        >
                            <span>Winner Winner</span>
                            <span>1000 reps</span>
                        </motion.div>
                    </div>
                </div>
                
            </div>
          
        )}
        {/* {activeButton === 'pullups' && (
            <div>
                <div onClick={() => setActiveButton('')} className='absolute top-2 right-4 border border-[#9f99ab54] text-[#9f99aba2] px-2 font-semibold rounded-md text-2xl flex justify-center items-center'>&times;</div>
                <div className="mx-6 mt-14 mb-6 rounded-md p-8 bg-[#120D18]">
                    
                    <h1 className="text-2xl font-bold">Pullups</h1>
                    <p className="mt-2 text-gray-600">
                    “Strength isn’t something you earn or inherit. You stake your life on it.” -Erwin
                    </p>
                </div>
            </div>
          
        )}
        {activeButton === 'running' && (
            <div>
                <div onClick={() => setActiveButton('')} className='absolute top-2 right-4 border border-[#9f99ab54] text-[#9f99aba2] px-2 font-semibold rounded-md text-2xl flex justify-center items-center'>&times;</div>
                <div className="mx-6 mt-14 mb-6 rounded-md p-8 bg-[#120D18]">
                    
                    <h1 className="text-2xl font-bold">Running</h1>
                    <p className="mt-2 text-gray-600">
                    Surpass Your Limits. Right Here. Right Now." -Yami
                    </p>
                </div>
            </div>
          
        )} */}
      </motion.div>
    </div>
        {/* <ul className=' space-y-16 mx-12'>
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
        </ul> */}
    </div>
  )
}
