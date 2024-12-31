import React, { useEffect, useState } from 'react';
import { LeaderboardAPI } from '../api/Leaderboard';
import supabase from '../api/supabase';
import { motion } from 'framer-motion';
import { MdHistory } from "react-icons/md";

export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    const fetchLeaderboard = async () => {
        const data = await LeaderboardAPI.get();
        console.log(data);
        setLeaderboard(data);
      };

    useEffect(() => {
        // Fetch initial leaderboard data
        fetchLeaderboard();
    
        // Subscribe to real-time updates using channel
        const leaderboardChannel = supabase.channel('leaderboard')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leaderboard' }, (payload) => {
            console.log('New leaderboard entry:', payload);
            fetchLeaderboard();  // Re-fetch leaderboard after change
          })
          .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'leaderboard' }, (payload) => {
            console.log('Updated leaderboard entry:', payload);
            fetchLeaderboard();  // Re-fetch leaderboard after change
          })
          .subscribe();
    
        // Clean up the subscription when the component is unmounted
        return () => {
          supabase.removeChannel(leaderboardChannel);
        };
      }, []);

  return (
    <>
        {/* <h1>Leaderboard</h1> */}
        <ul className='w-full items-center bg-transparent'>
            {leaderboard.length > 0 && leaderboard.map((entry, index) => (
                <div key={entry.user_id} className='w-[85%]'>
                    <div className='flex justify-between items-center p-2 text-[#46b9aa]'>
                        <h3 className=' font-semibold text-xl '>{entry.profiles.full_name}</h3>
                        <MdHistory className=' w-12 h-10 bg-black bg-opacity-20 p-[4px] rounded-md' />
                    </div>
                    
                    <motion.li 
                    key={entry.user_id} 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }} 
                    transition={{ duration: 0.5 }} // Animation for list items
                    className='w-full text-center bg-[#394651] rounded-md p-4 shadow-md'
                    >
                    <div className='space-y-2 text-xl'>
                        <motion.div
                        className='flex justify-between'
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.3 }} // Animation for the individual scores
                        >
                        <div>Pushups</div>
                        <motion.div 
                            key={entry.pushup_score} // Ensure it re-renders correctly on score change
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {entry.pushup_score}
                        </motion.div>
                        </motion.div>
                        <motion.div 
                        className='flex justify-between'
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.3 }} // Animation for the individual scores
                        >
                        <div>Pullups</div>
                        <motion.div 
                            key={entry.pullup_score}
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {entry.pullup_score}
                        </motion.div>
                        </motion.div>
                        <motion.div 
                        className='flex justify-between'
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }} 
                        transition={{ duration: 0.3 }} // Animation for the individual scores
                        >
                        <div>Miles</div>
                        <motion.div 
                            key={entry.running_score}
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            transition={{ type: 'spring', stiffness: 300 }}
                        >
                            {entry.running_score}
                        </motion.div>
                        </motion.div>
                    </div>
                    </motion.li>
                </div>
                
            ))}
        </ul>
    </>
  )
}
