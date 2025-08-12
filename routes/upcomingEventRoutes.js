/**
 * @swagger
 * components:
 *   schemas:
 *     UpcomingEvent:
 *       type: object
 *       required:
 *         - image_url
 *         - title
 *         - description
 *         - date
 *         - venue
 *       properties:
 *         image_url:
 *           type: string
 *           format: uri
 *           description: URL to event image
 *         title:
 *           type: string
 *           description: Event title
 *         description:
 *           type: string
 *           description: Event description
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event date and time
 *         venue:
 *           type: string
 *           description: Event venue/location
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Event creation timestamp
 *
 * tags:
 *   - name: UpcomingEvents
 *     description: API to manage upcoming events
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new upcoming event
 *     tags: [UpcomingEvents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Event data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpcomingEvent'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpcomingEvent'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all upcoming events
 *     tags: [UpcomingEvents]
 *     responses:
 *       200:
 *         description: List of upcoming events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UpcomingEvent'
 *       500:
 *         description: Server error
 */

const express = require("express");
const {
  createEvent,
  getEvents,
} = require("../controllers/upcomingEventController");
const { protect, communicationOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Only communication role can create events
router.post("/", protect, communicationOnly, createEvent);

// Public access to get events
router.get("/", getEvents);

module.exports = router;
