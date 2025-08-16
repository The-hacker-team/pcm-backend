const express = require("express");
const setupSwagger = require("../swagger");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://cavendish-pcm.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
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
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error(err));
