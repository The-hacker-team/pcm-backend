/**
 * @swagger
 * tags:
 *   name: Announcements
 *   description: Announcement management endpoints
 *
 * components:
 *   schemas:
 *     Announcement:
 *       type: object
 *       required:
 *         - title
 *         - message
 *       properties:
 *         _id:
 *           type: string
 *           description: Announcement ID
 *           example: 64d7bc2b2a1f123456789abc
 *         title:
 *           type: string
 *           description: Announcement title
 *           example: "Meeting Reminder"
 *         message:
 *           type: string
 *           description: Announcement message body
 *           example: "Don't forget the meeting on Friday at 3PM."
 *         createdBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 64d7b9a4e123456789abc123
 *             email:
 *               type: string
 *               example: user@example.com
 *             role:
 *               type: string
 *               example: Communication
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when announcement was created
 *           example: "2025-08-12T12:34:56.789Z"
 *
 * /announcements:
 *   post:
 *     summary: Create a new announcement (Communication role required)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Announcement data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - message
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Urgent Update"
 *               message:
 *                 type: string
 *                 example: "The system will be down for maintenance tonight."
 *     responses:
 *       201:
 *         description: Announcement created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Announcement posted successfully"
 *                 announcement:
 *                   $ref: '#/components/schemas/Announcement'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all announcements
 *     tags: [Announcements]
 *     responses:
 *       200:
 *         description: List of announcements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Announcement'
 *       500:
 *         description: Server error
 */

const express = require("express");
const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/announcementController");
const { protect, communicationOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Communication-only posting
router.post("/", protect, communicationOnly, createAnnouncement);

// Publicly visible announcements
router.get("/", getAnnouncements);

module.exports = router;
