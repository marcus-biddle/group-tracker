import express from 'express';
import { supabase } from '../db.js';

const router = express.Router();

// GET leaderboard
router.get("/", async(req, res) => {
    try {
        const { data, error } = await supabase.from("leaderboard").select("user_id, pushup_score, pullup_score, running_score") // .order("score", { ascending: false })

        if (error) return res.status(500).json({ error: error.message });

        res.json(data);
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
})

// POST update score
router.post("/update", async (req, res) => {
    const { user_id, exercise, score } = req.body;

    // Validate that exercise is one of the allowed values
    const validExercises = ['pushup', 'pullup', 'running'];
    if (!validExercises.includes(exercise)) {
        return res.status(400).json({ error: "Invalid exercise type. Valid types are pushup, pullup, or running." });
    }

    try {
        // Dynamically update the correct exercise score based on the input
        const { error } = await supabase
            .from("leaderboard")
            .upsert(
                { user_id, [`${exercise}_score`]: score, updated_at: new Date().toISOString() },
                { onConflict: "user_id" }
            );

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: `${exercise} score updated successfully!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// GET user's position
router.get("/position/:userId/:exercise", async (req, res) => {
    const { userId, exercise } = req.params;

    // Validate the exercise parameter
    const validExercises = ['pushup', 'pullup', 'running'];
    if (!validExercises.includes(exercise)) {
        return res.status(400).json({ error: "Invalid exercise type. Valid types are pushup, pullup, or running." });
    }

    try {
        // Fetch the specific exercise score for the user
        const { data, error } = await supabase
            .from("leaderboard")
            .select(`${exercise}_score`)
            .eq("user_id", userId)
            .single();  // Use .single() to get one record

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: "User not found on the leaderboard" });
        }

        // Send back the score for the specified exercise
        res.json({ [`${exercise}_score`]: data[`${exercise}_score`] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;