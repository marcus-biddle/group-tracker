import React, { useEffect, useState } from 'react';
import { LeaderboardAPI } from '../api/Leaderboard';
import supabase from '../api/supabase';
import { motion } from 'framer-motion'

export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);

    // useEffect(() => {
    //     const fetchLeaderboard = async () => {
    //         const data = await LeaderboardAPI.get();
    //         setLeaderboard(data);
    //     };
    //     fetchLeaderboard();
    // }, []);

    const fetchLeaderboard = async () => {
        const data = await LeaderboardAPI.get();
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
    <div>
        <h1>Leaderboard</h1>
        <ul>
  {leaderboard.map((entry, index) => (
    <motion.li 
      key={entry.user_id} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      transition={{ duration: 0.5 }} // Animation for list items
    >
      <h4>{entry.profiles.full_name}</h4>
      <div className='space-y-2'>
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
  ))}
</ul>
    </div>
  )
}
