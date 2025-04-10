import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { pool } from "../config/config.js"; // Your database pool
import dotenv from "dotenv";

dotenv.config();

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Request Password Reset (Sends Email)
const requestReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update Database with Token
    const [result] = await pool.query(
      "UPDATE users SET reset_token = ?, reset_expiry = ? WHERE email = ?",
      [resetToken, resetExpiry, email]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "Email not found." });
    }

    // Reset Link (Frontend URL)
    const resetLink = `http://localhost:4000/#/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;

    // Email Options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color: blue; text-decoration: none; font-weight: bold;">Reset Password</a>
        <p><strong>Note:</strong> This link will expire in 1 hour.</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Error sending reset email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Reset Password (Verifies Token & Updates Password)
const resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body; // ✅ Extract email from request body

    console.log("Received Token:", token);
    console.log("Received Email:", email);
    console.log("Received Password:", password);

    if (!token || !email || !password) {
      console.log("Missing token, email, or password");
      return res.status(400).json({ error: "Invalid request." });
    }

    // Find user by email & token
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_expiry > NOW()",
      [email, token]
    );

    if (rows.length === 0) {
      console.log("Invalid or expired token");
      return res.status(400).json({ error: "Invalid or expired reset link." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the password & clear token
    await pool.query(
      "UPDATE users SET password = ?, reset_token = NULL, reset_expiry = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    console.log("Password reset successful");

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export { requestReset, resetPassword };
