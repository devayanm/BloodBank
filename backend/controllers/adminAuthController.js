const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register Admin (for initial setup)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (!["admin", "moderator"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // DO NOT hash here!
    const user = new User({
      name,
      email,
      password, // plain password
      role,
    });

    await user.save();

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  // Only allow admin or moderator roles
  const user = await User.findOne({
    email,
    role: { $in: ["admin", "moderator"] },
  });
  if (!user)
    return res.status(401).json({ message: "Admin not found or unauthorized" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Optional: Admin Logout (for JWT, this is usually handled client-side by deleting the token)
exports.adminLogout = async (req, res) => {
  // For stateless JWT, just respond OK
  res.json({ message: "Logged out" });
};
