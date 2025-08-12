/**
 * @swagger
 * components:
 *   schemas:
 *     StudentRegistration:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phoneNumber
 *         - homeAddress
 *         - course
 *         - yearstartedschool
 *         - pcmDepartment
 *         - image_url
 *         - emergencyContact
 *       properties:
 *         firstName:
 *           type: string
 *           description: Student's first name
 *         lastName:
 *           type: string
 *           description: Student's last name
 *         phoneNumber:
 *           type: string
 *           description: Phone number
 *         homeAddress:
 *           type: string
 *         course:
 *           type: string
 *         yearstartedschool:
 *           type: integer
 *         pcmDepartment:
 *           type: string
 *         image_url:
 *           type: string
 *           format: uri
 *         emergencyContact:
 *           type: string
 *         createdBy:
 *           type: string
 *           description: User ID of who created the registration
 */

/**
 * @swagger
 * tags:
 *   name: StudentRegistrations
 *   description: Student registration management
 */

/**
 * @swagger
 * /student-registrations:
 *   post:
 *     summary: Create a new student registration
 *     tags: [StudentRegistrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentRegistration'
 *     responses:
 *       201:
 *         description: Student registration created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get all student registrations
 *     tags: [StudentRegistrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of student registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StudentRegistration'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

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
