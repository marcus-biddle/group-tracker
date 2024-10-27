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

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting Bearer <token>

  if (!token) {
      return res.status(401).json({ message: 'No token provided, authorization denied.' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden
      req.user = user; // Attach user to request
      next();
    });
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

app.get('/api/players', async (req, res) => {
  try {
    const query = `
      SELECT firstname, lastname FROM public.users;
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No players found.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/streak/update', authenticateToken, async (req, res) => {
  const { exercise_id } = req.body;
  const user_id = req.user.userId; // Assuming the user ID is available in the request after authentication

  if (!exercise_id || !user_id) {
      return res.status(400).json({ error: 'Exercise ID AND user ID is required' });
  }

  try {
    // Check if a record exists for the given exercise_id
    const existingRecordQuery = `
      SELECT streak_number, last_updated 
      FROM public.streak
      WHERE user_id = $1 AND exercise_id = $2
    `;
    const existingRecordParams = [user_id, exercise_id];
    const existingRecordResult = await pool.query(existingRecordQuery, existingRecordParams);
    console.log(existingRecordResult.rows[0]);
    // return res.status(200).json(existingRecordResult.rows[0]);

    if (existingRecordResult.rows.length > 0) {
      // Record exists, update the streak
      const { streak_number, last_updated } = existingRecordResult.rows[0];
      const currentDate = new Date();
    
      // Use PostgreSQL's date comparison with "AT TIME ZONE"
      const yesterday = new Date();
      yesterday.setDate(currentDate.getDate() - 1);
      
      // Format dates as UTC for comparison
      const currentDateDate = currentDate.toISOString().split('T')[0];
      const lastUpdatedDate = new Date(last_updated).toISOString().split('T')[0];
      const yesterdayDate = yesterday.toISOString().split('T')[0];

      // Check if last_updated was yesterday
      if (lastUpdatedDate === yesterdayDate) {
          // Update streak and last_updated
          const updatedStreak = streak_number + 1;
          const updateQuery = `
              UPDATE public.streak
              SET streak_number = $1, last_updated = $2 
              WHERE user_id = $3 AND exercise_id = $4
          `;
          const updateParams = [updatedStreak, new Date(), user_id, exercise_id];
          await pool.query(updateQuery, updateParams);
          return res.status(200).json({ message: 'Streak updated successfully', streak_number: updatedStreak });
      } else if (lastUpdatedDate === currentDateDate) {
        return res.status(200).json({ message: 'Streak already updated.'});
      } else {
        // Last update is not yesterday, reset the streak to 1
        const resetQuery = `
          UPDATE public.streak
          SET streak_number = 1, last_updated = $1 
          WHERE user_id = $2 AND exercise_id = $3
        `;
        const resetParams = [new Date(), user_id, exercise_id];
        await pool.query(resetQuery, resetParams);
        return res.status(200).json({ message: 'Streak reset to 1', streak_number: 1 });
      }
    } else {
      // Last update is not yesterday, reset the streak to 1
      const resetQuery = `
        INSERT INTO public.streak (user_id, exercise_id)
        VALUES ($1, $2)
      `;
      const resetParams = [user_id, exercise_id];
      await pool.query(resetQuery, resetParams);
      return res.status(200).json({ message: 'Streak reset to 1', streak_number: 1 });
    }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating streak' });
  }
})

app.get('/api/streak/player', authenticateToken, async (req, res) => {
  const user_id = req.user.userId;

  try {
    const query = `
      SELECT streak_number, exercise_id FROM public.streak WHERE user_id = $1;
    `;

    const updateParams = [user_id];
    const result = await pool.query(query, updateParams);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No streak found.' });
    }

    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
