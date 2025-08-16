const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if test user already exists
    const existingUser = await User.findOne({ email: "admin@test.com" });
    if (existingUser) {
      console.log("Test user already exists");
      return;
    }

    // Create test admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const testUser = new User({
      email: "admin@test.com",
      firstName: "Test",
      lastName: "Admin",
      phoneNumber: "+260971234567",
      password: hashedPassword,
      role: "admin",
    });

    await testUser.save();
    console.log("✅ Test user created successfully:");
    console.log("Email: admin@test.com");
    console.log("Password: admin123");
    console.log("Role: admin");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating test user:", error);
    mongoose.connection.close();
  }
}

createTestUser();
