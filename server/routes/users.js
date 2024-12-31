import express from 'express';
import { supabase } from '../db.js';

const router = express.Router();

// GET all users (Read all entries)
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("user_id, username, email, created_at");

        if (error) return res.status(500).json({ error: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET a single user by ID (Read a specific entry)
router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const { data, error } = await supabase
            .from("users")
            .select("user_id, username, email, created_at")
            .eq("user_id", user_id);

        if (error) return res.status(500).json({ error: error.message });

        if (data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(data[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST (Create a new user)
router.post("/", async (req, res) => {
    const { user_id, username, email } = req.body;

    if (!user_id || !username || !email) {
        return res.status(400).json({ error: "user_id, username, and email are required" });
    }

    try {
        const { data, error } = await supabase
            .from("users")
            .insert([{ user_id, username, email, created_at: new Date() }]);

        if (error) return res.status(500).json({ error: error.message });

        res.status(201).json({ message: "User created successfully", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT (Update an existing user)
router.put("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { username, email } = req.body;

    try {
        const { data, error } = await supabase
            .from("users")
            .update({ username, email })
            .eq("user_id", user_id);

        if (error) return res.status(500).json({ error: error.message });

        if (data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User updated successfully", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE (Delete an existing user)
router.delete("/:user_id", async (req, res) => {
    const { user_id } = req.params;

    try {
        const { data, error } = await supabase
            .from("users")
            .delete()
            .eq("user_id", user_id);

        if (error) return res.status(500).json({ error: error.message });

        if (data.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User deleted successfully", data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
