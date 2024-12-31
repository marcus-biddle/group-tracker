import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../db.js';

const router = express.Router();

// Environment variables for JWT secret and token expiration
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '1h';

// POST /auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Fetch user from database
        const { data, error } = await supabase
            .from('users')
            .select('user_id, email, password')
            .eq('email', email)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, data.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT
        const token = jwt.sign({ user_id: data.user_id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /auth/register
router.post('/register', async (req, res) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into database
        const { data, error } = await supabase
            .from('users')
            .insert([{ email, username, password: hashedPassword }]);

        if (error) return res.status(500).json({ error: error.message });

        res.status(201).json({ message: 'User registered successfully', data });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
