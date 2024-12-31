import React, { useState } from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import { LogPage } from '../sections/Log/LogPage';

export const UpdateModalButton = () => {
    const [open, isOpen] = useState(false);

  return (
    <div className='mx-8'>
        <AnimatePresence>
          <motion.button layoutId="log_exercise"
          className=' font-bold tracking-wide text-lg text-[#01b8aa] bg-[#121212] shadow-md flex place-self-end'
          onClick={() => isOpen(true)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 50 }}>
            Update
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
