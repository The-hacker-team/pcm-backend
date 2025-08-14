const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // You can use the decoded token data directly or fetch fresh data from DB
      // Option 1: Use token data directly (faster)
      req.user = {
        _id: decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
        phoneNumber: decoded.phoneNumber,
      };

      // Option 2: Fetch fresh data from database (more secure, always up-to-date)
      // req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Role check middleware for Admin role
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

// Role check middleware for Communication role
const communicationOnly = (req, res, next) => {
  if (req.user && req.user.role === "communication") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Access denied: Communication role required" });
  }
};

module.exports = { protect, adminOnly, communicationOnly };
