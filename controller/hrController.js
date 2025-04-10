import dotenv from "dotenv";
import { registerUser, getUserByEmail} from "../Model/authDb.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import * as db from "../Model/authDb.js"; // ✅ Import db correctly

dotenv.config();

// Register User (Default: user)
const registerCon = async (req, res) => {
    const { name, email, password, role = "employee" } = req.body;
    
    if (role !== "employee" && role !== "admin") {
        return res.status(400).json({ error: "Invalid role specified" });
    }

    const result = await registerUser(name, email, password, role);
    if (!result.success) return res.status(500).json({ error: result.error });

    res.json({ message: result.message });
};

// Admin Registration
const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;
    const existingAdmin = await getUserByEmail(email);
    if (existingAdmin) return res.status(400).json({ error: "Admin already exists" });

    const result = await registerUser(name, email, password, null, null, "admin");
    if (!result.success) return res.status(500).json({ error: result.error });

    res.json({ success: true, message: "Admin registered successfully" });
};

// User Login
const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user || user.role !== "user") return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ user_id: user.user_id, role: user.role });
};

// Admin Login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await getUserByEmail(email);
        if (!admin || admin.role !== "admin") return res.status(401).json({ error: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ error: "Invalid password" });

        res.json({ user_id: admin.user_id, role: admin.role });
    } catch (error) {
        console.error("Error in adminLogin:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Forgot Password Controller
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Generate correct reset link
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await db.updateResetToken(email, resetToken, resetExpiry);

        // ✅ Make sure it uses 8080, not 5050
        const resetLink = `http://localhost:4000/reset-password?token=${resetToken}`;

        await sendEmail(email, "Password Reset Request", resetLink);

        res.status(200).json({ message: "Reset email sent" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// ✅ Export functions (resetPassword function removed)
export { registerCon, registerAdmin, login, adminLogin, forgotPassword };
