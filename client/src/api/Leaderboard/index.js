// Create a new leaderboard entry (score)
import { Leaderboard } from '../../components/Leaderboard';
import supabase from '../supabase';

const getUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id; // Returns the user's ID if authenticated
};

const updateLeaderboardEntry = async (userId, exercise, score) => {
  try {
    const { data: existingData, error: fetchError } = await supabase
      .from('leaderboard')
      .select(`${exercise}_score`)
      .eq('user_id', userId)
      .single(); // Get a single row

    if (fetchError) throw fetchError;

    const updatedScore = existingData[`${exercise}_score`] + score;
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert([{ user_id: userId, [`${exercise}_score`]: updatedScore }], { onConflict: 'user_id' });

    if (error) throw error;
    console.log('Leaderboard entry updated:', data);

    return data;
  } catch (err) {
    console.error('Error updating leaderboard entry:', err.message);
  }
};





// Fetch the full leaderboard
const getLeaderboard = async () => {
  try {
    // First query to get leaderboard data
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('user_id, pushup_score, pullup_score, running_score, profiles!fk_leaderboard_user_id(full_name)');

      console.log('leaderboard', leaderboard)
    if (leaderboardError) {
      throw new Error(leaderboardError.message);
    }

      return leaderboard;
  } catch (err) {
    console.error("Error fetching leaderboard:", err.message);
    return null;
  }
};


  
// Fetch a single user's score (example: pushup score)
const getUserScore = async (userId, exercise) => {
  try {
      const { data, error } = await supabase
      .from('leaderboard')
      .select(`${exercise}_score`)
      .eq('user_id', userId)
      .single();  // Fetch single record

      if (error) throw error;
      return data ? data[`${exercise}_score`] : null;
  } catch (err) {
      console.error(`Error fetching ${exercise} score:`, err.message);
  }
};

  
export const LeaderboardAPI = {
    get: getLeaderboard,
    update: updateLeaderboardEntry,
}