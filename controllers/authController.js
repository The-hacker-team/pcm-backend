const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phoneNumber: user.phoneNumber,
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

// Admin-protected registration
const registerUser = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming data

    const {
      email,
      firstName,
      lastName,
      phoneNumber,
      password,
      role,
    } = req.body;

    // Validate all required fields
    if (
      !email ||
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !password ||
      !role
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      email,
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
      role,
    });

    // Save user
    await newUser.save();

    // Return success and user data (excluding password)
    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(newUser),
      user: {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Public login
const loginUser = async (req, res) => {
  try {
    console.log("Login request body:", req.body);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        message: "Login successful",
        token: generateToken(user),
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all registered users (All authenticated users can view)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    res.json({
      message: "Users retrieved successfully",
      count: users.length,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get users by role (All authenticated users can view)
const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    // Validate role parameter
    const validRoles = ["admin", "user", "communication"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Valid roles are: admin, user, communication",
      });
    }

    const users = await User.find({ role })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      message: `Users with role '${role}' retrieved successfully`,
      count: users.length,
      role: role,
      users: users.map((user) => ({
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      message: "User deleted successfully",
      deletedUser: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  getUsersByRole,
  deleteUser,
};
