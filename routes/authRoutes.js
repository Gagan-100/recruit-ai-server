const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { signup, login, getMe } = require("../controllers/authController");

//  Signup 
// Register a new user
router.post("/signup", signup);

//  Login 
// Authenticate user and return JWT token
router.post("/login", login);

//  Get current user 
// Protected route to fetch logged-in user details
router.get("/me", authMiddleware, getMe);

module.exports = router;