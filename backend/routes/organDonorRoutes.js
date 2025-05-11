const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  registerOrganDonor,
  getNearbyOrganDonors,
} = require("../controllers/organDonorController");

router.post("/", auth, registerOrganDonor);
router.get("/nearby", getNearbyOrganDonors);

module.exports = router;
