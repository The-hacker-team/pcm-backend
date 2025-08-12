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
