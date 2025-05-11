const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const {
  registerDonor,
  getNearbyDonors,
} = require("../controllers/donorController");

router.route("/").post(auth, registerDonor);

router.route("/nearby").get(getNearbyDonors);

module.exports = router;
