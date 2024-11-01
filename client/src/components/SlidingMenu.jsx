import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TfiMenu, TfiClose } from "react-icons/tfi";
import { NavLink, useNavigate } from 'react-router-dom';

export const SlidingMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const menuVariants = {
        open: { x: 0, transition: { type: 'spring', stiffness: 300 } },
        closed: { x: '-100%', transition: { type: 'spring', stiffness: 300 } },
    };

    return (
        <div className="relative">
            {/* Button to open the menu */}
            <button onClick={toggleMenu} className=' border-[#00B2CC] bg-transparent border-2 z-50 opacity-100'>
                
                {isOpen ? <TfiClose className=' w-full h-full text-[#00B2CC]' /> : <TfiMenu className=' w-full h-full text-[#00B2CC]' />}
            </button>

            {/* Sliding Menu */}
            <motion.div
                className="fixed top-0 left-0 w-64 h-full bg-[#241A2D] shadow-lg z-50"
                initial={{ x: '-100%' }}
                animate={isOpen ? 'open' : 'closed'}
                variants={menuVariants}
            >
                <div className="p-4">
                    <h2 className="text-4xl mb-4 text-[#ECEAFA]">Menu</h2>
                    <ul className=' space-y-4 text-2xl text-[#777481] capitalize font-semibold'>
                        <li>
                            <NavLink to={'/'} onClick={() => setIsOpen(false)}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/activities/1/pushups'} onClick={() => setIsOpen(false)}>Pushups</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/activities/2/pullups'} onClick={() => setIsOpen(false)}>Pullups</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/activities/3/running'} onClick={() => setIsOpen(false)}>Running</NavLink>
                        </li>
                    </ul>
                    
                    <button onClick={() => navigate('/auth')} className="w-full mt-4 px-4 py-2 rounded-md shadow-md bg-transp border-[#00B2CC] border-2 text-[#00B2CC]">
                        Login
                    </button>
                </div>
            </motion.div>

            {/* Overlay to close the menu when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 z-40"
                    onClick={toggleMenu}
                ></div>
            )}
        </div>
    );
};
