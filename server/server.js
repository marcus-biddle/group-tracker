import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { pool } from './db.js';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { createTables } from './createTables.js';
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

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting Bearer <token>

  if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
      // Verify the token using your secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach the decoded token payload (e.g., user_id) to req.user
      next(); // Proceed to the next middleware or route handler
  } catch (err) {
      return res.status(403).json({ message: 'Invalid token, authorization denied.' });
  }
};

// Route to create a new user (signup)
app.post('/api/users/signup', async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  const hashedPassword = await hashPassword(password);

  try {
    const result = await pool.query(
      'INSERT INTO public.users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING id, email, firstname, lastname',
      [email, hashedPassword, firstname, lastname]
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

// Route to Get exercise log of specific exercise
app.post('/api/exercises/log', async (req, res) => {
  const { exerciseId, month, year } = req.body;

    try {
        // Base query without optional filters
        let query = `
        SELECT 
            u.id AS user_id,
            CONCAT(u.firstname, ' ', u.lastname) AS fullname,
            SUM(el.exercise_count) AS total_exercise_count
        FROM 
            public.exercise_log el
        JOIN 
            public.users u
            ON el.user_id = u.id
        WHERE 
            el.exercise_id = $1
            AND EXTRACT(MONTH FROM el.date) = $2   
            AND EXTRACT(YEAR FROM el.date) = $3    
        GROUP BY 
            u.id, u.firstname, u.lastname;
        `

        // Execute the query
        const result = await pool.query(query, [exerciseId, month, year]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve exercises' });
    }
});

// Update a user's log
app.post('/api/exercises/log/insert', authenticateToken, async (req, res) => {
  const { user_id, exercise_count, date, exercise_id } = req.body;
  console.log({ user_id, exercise_count, date, exercise_id })

  try {
      // Build the SQL update query
      const query = `
      INSERT INTO public.exercise_log (user_id, exercise_id, exercise_count, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;  
      `;

      const result = await pool.query(query, [
          user_id,
          exercise_id,
          exercise_count,
          date
      ]);

      if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Exercise log not found or user does not match.' });
      }

      res.status(200).json(result.rows[0]);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating exercise log' });
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
