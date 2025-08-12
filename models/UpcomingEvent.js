const mongoose = require("mongoose");

const upcomingEventSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
  },
  venue: {
    type: String,
    required: [true, "Venue is required"],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UpcomingEvent", upcomingEventSchema);
