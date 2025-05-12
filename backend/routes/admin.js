const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/admin");

// Controllers
const adminAuth = require("../controllers/adminAuthController");
const userCtrl = require("../controllers/adminUserController");
const organCtrl = require("../controllers/adminOrganDonorController");
const bloodCtrl = require("../controllers/adminBloodDonorController");

// ===== Admin Auth Routes (public) =====
router.post("/auth/register", adminAuth.registerAdmin);
router.post("/auth/login", adminAuth.adminLogin);
router.post("/auth/logout", adminAuth.adminLogout); // optional

// ===== All routes below require admin authentication =====
router.use(auth, admin);

// User CRUD
router.get("/users", userCtrl.getAllUsers);
router.get("/users/:id", userCtrl.getUser);
router.post("/users", userCtrl.createUser);
router.put("/users/:id", userCtrl.updateUser);
router.delete("/users/:id", userCtrl.deleteUser);

// Organ Donor CRUD
router.get("/organ-donors", organCtrl.getAllOrganDonors);
router.get("/organ-donors/:id", organCtrl.getOrganDonor);
router.post("/organ-donors", organCtrl.createOrganDonor);
router.put("/organ-donors/:id", organCtrl.updateOrganDonor);
router.delete("/organ-donors/:id", organCtrl.deleteOrganDonor);

// Blood Donor CRUD
router.get("/blood-donors", bloodCtrl.getAllBloodDonors);
router.get("/blood-donors/:id", bloodCtrl.getBloodDonor);
router.post("/blood-donors", bloodCtrl.createBloodDonor);
router.put("/blood-donors/:id", bloodCtrl.updateBloodDonor);
router.delete("/blood-donors/:id", bloodCtrl.deleteBloodDonor);

module.exports = router;
