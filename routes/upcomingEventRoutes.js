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
