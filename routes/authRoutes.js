const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only register
router.post("/register", protect, adminOnly, registerUser);

// Public login
router.post("/login", loginUser);

module.exports = router;
