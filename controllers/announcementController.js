const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const newAnnouncement = new Announcement({
      title,
      message,
      createdBy: req.user._id,
    });

    // Save to database
    const savedAnnouncement = await newAnnouncement.save();

    // Populate createdBy field for better output
    await savedAnnouncement.populate(
      "createdBy",
      "email role",
      // "firstName lastName"
    );

    // Return the saved document
    res.status(201).json({
      message: "Announcement posted successfully",
      announcement: savedAnnouncement,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().populate(
      "createdBy",
      "email role"
    );
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createAnnouncement, getAnnouncements };
