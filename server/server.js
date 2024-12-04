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
  const { exercise_id, month, year, day } = req.body;
  console.log('Parameters:', { exercise_id, month, year, day });
  try {
    const query = `
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
          AND ($4 = -1 OR EXTRACT(DAY FROM el.date) = $4)  
      GROUP BY 
          u.id, u.firstname, u.lastname
      ORDER BY 
        total_exercise_count DESC;
    `;

    // Execute the query
    const result = await pool.query(query, [exercise_id, month, year, day]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve exercises' });
  }
});

app.post('/api/exercises/log/user', authenticateToken, async (req, res) => {
  const { user_id } = req.body;
  console.log('Parameters:', { user_id });

  try {
    const query = `
      SELECT 
          el.id AS log_id,
          u.id AS user_id,
          CONCAT(u.firstname, ' ', u.lastname) AS fullname,
          el.exercise_count,
          el.date,
          el.exercise_id,
          et.exercise_name  -- Include exercise name
      FROM 
          public.exercise_log el
      JOIN 
          public.users u ON el.user_id = u.id
      JOIN 
          public.exercise_types et ON el.exercise_id = et.exercise_id  -- Join with exercise_type to get exercise_name
      WHERE 
          u.id = $1  -- Only filter by user_id
      ORDER BY 
          el.date DESC;
    `;

    const result = await pool.query(query, [user_id]);

    // Process the result into the desired format
    const groupedData = result.rows.reduce((acc, { user_id, fullname, date, exercise_id, exercise_count, exercise_name, log_id }) => {
      // Format date to 'YYYY-MM-DD' for consistency
      const formattedDate = new Date(date).toISOString().split('T')[0];

      // If the user does not exist in the accumulator, add them
      if (!acc[user_id]) {
        acc[user_id] = {
          user_id,
          fullname,
          dates: {} // This will store dates as keys
        };
      }

      // If the date does not exist for the user, add it
      if (!acc[user_id].dates[formattedDate]) {
        acc[user_id].dates[formattedDate] = {
          date: formattedDate,
          exercises: [] // Initialize an empty array for exercises on this date
        };
      }

      // Add the exercise data to the correct date and user
      const existingExercise = acc[user_id].dates[formattedDate].exercises.find(exercise => exercise.exercise_id === exercise_id);
      
      if (existingExercise) {
        existingExercise.total_exercise_count += parseInt(exercise_count, 10); // Add to existing exercise count
      } else {
        acc[user_id].dates[formattedDate].exercises.push({
          log_id,
          exercise_id,
          exercise_name: exercise_name, // Include the exercise name
          total_exercise_count: parseInt(exercise_count, 10) // Create a new exercise entry
        });
      }

      return acc;
    }, {});

    // Convert the grouped data into an array and send as response
    const responseData = Object.values(groupedData).map(user => ({
      user_id: user.user_id,
      fullname: user.fullname,
      dates: Object.values(user.dates)
    }));

    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve exercises' });
  }
});



app.post('/api/exercises/log/all', async (req, res) => {
  const { month, year, day } = req.body;
  console.log('Parameters:', { month, year, day });
  try {
    const query = `
    SELECT 
        u.id AS user_id,
        CONCAT(u.firstname, ' ', u.lastname) AS fullname,
        e.exercise_id AS exercise_id,
        e.exercise_name AS exercise_name,
        SUM(el.exercise_count) AS total_exercise_count
    FROM 
        public.exercise_log el
    JOIN 
        public.users u
        ON el.user_id = u.id
    JOIN 
        public.exercise_types e
        ON el.exercise_id = e.exercise_id
    WHERE 
        EXTRACT(MONTH FROM el.date) = $1  -- Filter by month
        AND EXTRACT(YEAR FROM el.date) = $2 -- Filter by year
        AND ($3 = -1 OR EXTRACT(DAY FROM el.date) = $3) -- Optional filter by day
    GROUP BY 
        u.id, fullname, e.exercise_id, e.exercise_name
    ORDER BY 
        total_exercise_count DESC;
    `;

    // Execute the query
    const result = await pool.query(query, [month, year, day]);
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
      SELECT CONCAT(firstname, ' ', lastname) AS fullname, id FROM public.users;
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

app.post('/api/user/info', async (req, res) => {
  const { user_id } = req.body; // Assuming user_id is a UUID

  try {
    // Query to calculate the total count, log count, user full name, and additional stats for each exercise
    const query = `
      SELECT 
        CONCAT(u.firstname, ' ', u.lastname) AS fullname,
        et.exercise_name,
        SUM(e.exercise_count) AS total_count,
        COUNT(e.id) AS log_count,
        DATE_PART('day', MAX(e.date) - MIN(e.date)) + 1 AS days_logged,
        MAX(e.date) AS last_log_date,
        MIN(e.date) AS first_log_date
      FROM exercise_log e
      INNER JOIN exercise_types et
        ON e.exercise_id = et.exercise_id
      INNER JOIN users u
        ON e.user_id = u.id
      WHERE e.user_id = $1
      GROUP BY fullname, et.exercise_name;
    `;

    const result = await pool.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No exercise data found for this user' });
    }

    // Process the results
    const exercises = result.rows.map(row => ({
      exercise_name: row.exercise_name,
      total_count: parseInt(row.total_count, 10),
      log_count: parseInt(row.log_count, 10),
      days_logged: row.days_logged,
      last_log_date: row.last_log_date,
      first_log_date: row.first_log_date
    }));

    const fullname = result.rows[0]?.fullname; // Assuming all rows have the same fullname for the user_id

    return res.json({ fullname, exercises });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
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
      res.status(500).json({ message: 'Error updating streak', err: err });
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

// Add authenticate to this after testing
app.put('/api/exercises/log', async (req, res) => {
  const { log_id, date, exercise_count } = req.body;

  if (!log_id || !date || exercise_count == null) {
    return res.status(400).json({ error: 'Please provide id, date, and count' });
  }

  try {
    const query = `
      UPDATE public.exercise_log
      SET date = $1, exercise_count = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [date, exercise_count, log_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({
      message: 'Record updated successfully',
      record: result.rows[0],
    });
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({ error: 'Failed to update record' });
  }
});

app.delete('/api/records/:recordId', async (req, res) => {
  const { recordId } = req.params; // Extract recordId from the URL

  console.log(recordId)

  try {
    const result = await pool.query('DELETE FROM public.exercise_log WHERE id = $1', [recordId]);

    // Check if the record was found and deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    // Successfully deleted the record
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete record' });
  }
});

app.post('/api/exercises/add', authenticateToken, async (req, res) => {
  const { user_id, exercise_id, exercise_count, date } = req.body;
  console.log(user_id, exercise_id, exercise_count, date );

  // Validate the request
  if (!user_id || !exercise_id || !exercise_count || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = `
      INSERT INTO exercise_log (user_id, exercise_id, exercise_count, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *;  
    `;

    const values = [user_id, exercise_id, exercise_count, new Date(date)];

    // Execute the query
    const result = await pool.query(query, values);

    // Respond with the newly created record
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add exercise record' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
