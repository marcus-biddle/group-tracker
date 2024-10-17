import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { pool } from './db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
// import authRoutes from './routes/auth.js'

dotenv.config();  // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
// Routes
// app.use('/api/auth', authRoutes);

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.send(result.rows[0]);
  } catch (err) {
    res.status(500).send('Database connection failed');
  }
});

// Hash passwords before saving them
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Compare hashed passwords for login
const comparePasswords = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// Route to create a new user (signup)
app.post('/api/users/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const result = await pool.query(
      'INSERT INTO public.users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    return res.status(201).json(result.rows[0]);  // Return the newly created user
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating user');
  }
});

// Route to log in a user
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM public.users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = result.rows[0];
    const validPassword = await comparePasswords(password, user.password);

    if (!validPassword) {
      return res.status(400).send('Invalid password');
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error logging in');
  }
});

// Route to Get exercises
app.get('/api/exercises', async (req, res) => {
  try {
    // Query to get all exercises from the exercise_types table
    const query = `
      SELECT * FROM public.exercise_types;
    `;

    const result = await pool.query(query);

    // Check if exercises are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No exercises found.' });
    }

    // Respond with the list of exercises
    res.status(200).json(result.rows); // Return all exercises
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
