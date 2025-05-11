const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const {
  registerUser,
  loginUser,
  verifyAccount,
  refreshToken,
  logoutUser,
  forgotPassword,
} = require("../controllers/authController");

const router = express.Router();

// ✅ Rate Limiting to prevent brute force attacks
const loginRegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
  message: "Too many attempts. Try again later.",
});

// ✅ User Registration Validation
router.post(
  "/register",
  loginRegisterLimiter,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("bloodType").notEmpty().withMessage("Blood type is required"),
  ],
  registerUser
);

// ✅ User Login Validation
router.post(
  "/login",
  loginRegisterLimiter,
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser
);

// ✅ Verify Account
router.get("/verify/:token", verifyAccount);

// ✅ Refresh Token Route
router.post("/refresh-token", refreshToken);

// ✅ Logout Route
router.post("/logout", logoutUser);

// ✅ Forgot Password Route
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Invalid email format")],
  forgotPassword
);

module.exports = router;
