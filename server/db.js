import pkg from 'pg';  // Import the entire module
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;  // Destructure Pool from the imported module

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Use DATABASE_URL for cloud or local connection
  ssl: {
    rejectUnauthorized: false, // Render and many cloud providers require this setting
  },
});
