const UpcomingEvent = require("../models/UpcomingEvent");

// Create new event
const createEvent = async (req, res) => {
  try {
    const { image_url, title, description, date, venue } = req.body;

    if (!image_url || !title || !description || !date || !venue) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEvent = new UpcomingEvent({
      image_url,
      title,
      description,
      date,
      venue,
      createdBy: req.user._id,
    });

    await newEvent.save();
    // Populate createdBy field for better output
    await newEvent.populate("createdBy", "email role firstName lastName");

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await UpcomingEvent.find().sort({ date: 1 }); // sorted by date ascending
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createEvent, getEvents };
