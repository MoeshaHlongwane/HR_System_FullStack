import { pool } from "../config/config.js";
import bcrypt from "bcryptjs";

// Register User (or Admin)
const registerUser = async (name, email, password, role = "employee") => {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      const [result] = await pool.query(query, [name, email, hashedPassword, role]);
  
      if (result.affectedRows === 0) {
        return { success: false, error: "User registration failed." };
      }
  
      return { success: true, message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully` };
    } catch (error) {
      console.error("Error in registerUser:", error);
      return { success: false, error: error.message || "Database error" };
    }
};

// Get user by email
const getUserByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
};

export { registerUser, getUserByEmail };
