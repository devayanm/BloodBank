const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/admin");

// Profile routes
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.put("/change-password", auth, changePassword);

// Admin routes
router.get("/", auth, admin, getAllUsers);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
