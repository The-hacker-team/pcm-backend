const express = require("express");
const setupSwagger = require("../swagger");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5174", // or wherever your React app is running
    credentials: true,
  })
);
// Middleware
app.use(express.json());
setupSwagger(app);

// Routes
const authRoutes = require("../routes/authRoutes");
const announcementRoutes = require("../routes/announcementRoutes");
const upcomingEventRoutes = require("../routes/upcomingEventRoutes");
const studentRegistrationRoutes = require("../routes/studentRegistrationRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/events", upcomingEventRoutes);
app.use("/api/student-registrations", studentRegistrationRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {
    console.log("MongoDB connected");
    console.log("MongoDB connected process", process.env.MONGO_URI);
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
