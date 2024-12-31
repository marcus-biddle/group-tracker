import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TopNav } from './sections/TopNav'
import { Introduction } from './sections/Home/Introduction'
import { IntroList } from './sections/Home/IntroList'
import { Outlet, useLocation, useMatches } from 'react-router'
import { isAuthenticated } from './helpers/authHelper'
import {AnimatePresence, motion} from 'framer-motion'
import { FiPlus } from "react-icons/fi";

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { LogPage } from './sections/Log/LogPage'

function App() {
  const [open, isOpen] = useState(false);
  const COLOR_PATH_CHART = [
    // {params: '1', BgColor: 'bg-teal-300'},
    // {params: '2', BgColor: 'bg-red-300'},
    // {params: '3', BgColor: 'bg-green-500'},
  ];

  const matches = useMatches();
  const matchedPath = COLOR_PATH_CHART.find(item => item.params === matches[0].params.activityId);

  // console.log(matches[0].params.activityId);

  return (
      <div className={`relative min-h-screen`}>
        <TopNav />
        <div className=''>
          <Outlet />
        </div>
        <AnimatePresence>
          <motion.button layoutId="log_exercise" style={{ position: 'fixed', bottom: '5%', right: '10%', width: '4rem', height: '4rem'}}
          onClick={() => isOpen(true)}
          className=' shadow-2xl border border-neutral-200 bg-slate-400'
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}>
            <FiPlus className=' w-full h-full text-black' />
          </motion.button>
        </AnimatePresence>
        
        {open && 
        <motion.div layoutRoot className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center' onClick={() => isOpen(false)}>
        <div onClick={(e) => e.stopPropagation()}>
        <motion.div layoutId="log_exercise">
          <div className="relative bg-[#191B1F] min-w-[300px] w-full min-h-[600px] rounded-md text-white text-center p-4 flex flex-col justify-center">
            <LogPage />
          </div>
        </motion.div>

        </div>
      </motion.div>}
      </div>
  )
}

export default App
