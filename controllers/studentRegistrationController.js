const StudentRegistration = require("../models/StudentRegistration");

// Create new student registration
const createStudentRegistration = async (req, res) => {
  try {
    const {
      studentFirstName,
      studentLastName,
      phoneNumber,
      homeAddress,
      course,
      yearstartedschool,
      pcmDepartment,
      image_url,
      emergencyContact,
    } = req.body;

    // Validate required fields
    if (
      !studentFirstName ||
      !studentLastName ||
      !phoneNumber ||
      !homeAddress ||
      !course ||
      !yearstartedschool ||
      !pcmDepartment ||
      !image_url ||
      !emergencyContact
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRegistration = new StudentRegistration({
      studentFirstName,
      studentLastName,
      phoneNumber,
      homeAddress,
      course,
      yearstartedschool,
      pcmDepartment,
      image_url,
      emergencyContact,
      createdBy: req.user._id,
    });

    await newRegistration.save();

    // Populate createdBy field for better output
    await newRegistration.populate(
      "createdBy",
      "email role"
      //   "firstName lastName"
    );

    res.status(201).json({
      message: "Student registration created successfully",
      registration: newRegistration,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all student registrations
const getStudentRegistrations = async (req, res) => {
  try {
    const registrations = await StudentRegistration.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createStudentRegistration, getStudentRegistrations };
