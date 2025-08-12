const mongoose = require("mongoose");

const studentRegistrationSchema = new mongoose.Schema({
  studentFirstName: {
    type: String,
    required: [true, "First name is required"],
  },
  studentLastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  homeAddress: {
    type: String,
    required: [true, "Home address is required"],
  },
  course: {
    type: String,
    required: [true, "Course is required"],
  },
  yearstartedschool: {
    type: Number,
    required: [true, "Year started school is required"],
  },
  pcmDepartment: {
    type: String,
    required: [true, "PCM Department is required"],
  },
  image_url: {
    type: String,
    required: [true, "Image URL is required"],
  },
  emergencyContact: {
    type: String,
    required: [true, "Emergency contact is required"],
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

module.exports = mongoose.model(
  "StudentRegistration",
  studentRegistrationSchema
);
