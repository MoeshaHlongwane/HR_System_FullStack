import mysql2 from 'mysql2/promise';
import { config } from 'dotenv';
config();

// Create the pool using environment variables
const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Check the connection
const checkConnection = async () => {
  try {
    // Attempt to get a connection from the pool
    const connection = await pool.getConnection();
    console.log("Connected successfully!");
    connection.release(); // Always release the connection after use
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
};

// Call the function to check the connection
checkConnection();

// Export the pool for use in other modules
export {pool};
