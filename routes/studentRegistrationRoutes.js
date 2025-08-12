const express = require("express");
const {
  createStudentRegistration,
  getStudentRegistrations,
} = require("../controllers/studentRegistrationController");
const {
  protect,
  adminOnly,
  communicationOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Example: only Communication and Admin can create student registrations
router.post(
  "/",
  protect,
  (req, res, next) => {
    const allowedRoles = ["Admin", "Communication", "Secretary", "Treasurer"];
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  },
  createStudentRegistration
);

// Anyone logged in can view registrations (or restrict as you want)
router.get("/", protect, getStudentRegistrations);

module.exports = router;
