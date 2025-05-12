const User = require("../models/User");
const bcrypt = require("bcryptjs");

// List all users (with Content-Range and id field for react-admin)
exports.getAllUsers = async (req, res) => {
  // Parse range for pagination
  let range = [0, 9];
  if (req.query.range) {
    try {
      range = JSON.parse(req.query.range);
    } catch {}
  }
  const [start, end] = range;
  const limit = end - start + 1;

  const total = await User.countDocuments();
  const users = await User.find().skip(start).limit(limit).select("-password");

  // Add id field
  const usersWithId = users.map((u) => ({ ...u.toObject(), id: u._id }));

  // Set Content-Range header
  res.set(
    "Content-Range",
    `users ${start}-${start + usersWithId.length - 1}/${total}`
  );
  res.json(usersWithId);
};

// Get single user
exports.getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ ...user.toObject(), id: user._id });
};

// Create user (admin)
exports.createUser = async (req, res) => {
  const { name, email, password, bloodType, role } = req.body;
  if (!name || !email || !password || !bloodType)
    return res.status(400).json({ message: "All fields required" });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Email already exists" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
    bloodType,
    role: role || "user",
    isVerified: true,
  });
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    bloodType: user.bloodType,
    role: user.role,
  });
};

// Update user (admin)
exports.updateUser = async (req, res) => {
  const { name, email, bloodType, role, isVerified } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.bloodType = bloodType ?? user.bloodType;
  user.role = role ?? user.role;
  user.isVerified = isVerified ?? user.isVerified;
  await user.save();
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    bloodType: user.bloodType,
    role: user.role,
  });
};

// Delete user (admin)
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
};
