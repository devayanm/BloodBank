const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");
const { getVerificationEmailHtml } = require("../utils/emailTemplates");
const TokenBlacklist = require("../models/TokenBlacklist");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password, bloodType, role = "user" } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, bloodType, role });

    if (user) {
      const verificationToken = generateToken(user._id, "1d");
      const verificationUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

      await sendEmail({
        to: user.email,
        subject: "Verify your account",
        text: `Click on the link to verify your account: ${verificationUrl}`,
        html: getVerificationEmailHtml(user.name, verificationUrl),
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(`❌ Register Error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Check if password matches
    if (!(await user.matchPassword(password))) {
      user.failedLoginAttempts += 1;
      await user.save();

      // ✅ Lock account after 5 failed attempts
      if (user.failedLoginAttempts >= 5) {
        return res.status(403).json({
          message: "Account locked due to multiple failed login attempts",
        });
      }

      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    await user.save();

    // ✅ Issue access token and refresh token
    const token = generateToken(user._id);
    const refreshToken = user.getRefreshToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      refreshToken,
    });
  } catch (error) {
    console.error(`❌ Login Error: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Verify Account
const verifyAccount = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    console.error(`❌ Verification Error: ${error.message}`);
    res.status(400).json({ message: "Invalid token" });
  }
};

// ✅ Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // ✅ Issue new token
    const newToken = generateToken(user._id);
    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error(`❌ Refresh Token Error: ${error.message}`);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

// ✅ Logout User
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // ✅ Blacklist token
    await TokenBlacklist.create({ token, expiresAt: new Date() });

    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error(`❌ Logout Error: ${error.message}`);
    res.status(500).json({ message: "Failed to logout" });
  }
};

// ✅ Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = generateToken(user._id, "1h");

    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: `Click the link to reset your password: ${process.env.CLIENT_URL}/reset-password/${resetToken}`,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error(`❌ Forgot Password Error: ${error.message}`);
    res.status(500).json({ message: "Failed to send reset email" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyAccount,
  refreshToken,
  logoutUser,
  forgotPassword,
};
