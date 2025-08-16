/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and user registration
 *
 * components:
 *   schemas:
 *     UserRegistration:
 *       type: object
 *       required:
 *         - email
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - password
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         phoneNumber:
 *           type: string
 *           example: "+260971234567"
 *         password:
 *           type: string
 *           format: password
 *           example: strongPassword123
 *         role:
 *           type: string
 *           enum: [Admin, Communication, Secretary, Treasurer]
 *           example: Communication
 *
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: strongPassword123
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         role:
 *           type: string
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phoneNumber:
 *           type: string
 *         token:
 *           type: string
 *           description: JWT token for authenticated requests
 *
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin-protected)
 *     tags: [Auth]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation or user already exists error
 *       500:
 *         description: Internal server error
 *
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Successful login with user info and token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */

const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUsersByRole,
  deleteUser,
} = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only register
router.post("/register", protect, adminOnly, registerUser);

// Public login
router.post("/login", loginUser);

// Get all users (All authenticated users can view)
router.get("/users", protect, getAllUsers);

// Get users by role (All authenticated users can view)
router.get("/users/role/:role", protect, getUsersByRole);

// Delete user (Admin only)
router.delete("/users/:id", protect, adminOnly, deleteUser);

module.exports = router;
