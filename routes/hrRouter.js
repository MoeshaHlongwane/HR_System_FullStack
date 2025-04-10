import express from "express";
import { 
    registerCon, 
    registerAdmin, 
    login, 
    adminLogin, 
    forgotPassword,
} from "../Controller/authCon.js";

const router = express.Router();

// User Routes
router.post("/register", registerCon);
router.post("/login", login);
router.post("/forgot-password", forgotPassword); // Added Forgot Password Route

// Admin Routes
router.post("/admin/register", registerAdmin);
router.post("/admin/login", adminLogin);

export default router;
