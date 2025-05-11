const express = require("express");
const {
  registerOrgan,
  findCompatibleOrgans,
  matchOrgan,
  updateOrganStatus,
} = require("../controllers/organController");

const router = express.Router();

router.post("/register", registerOrgan);
router.get("/search", findCompatibleOrgans);
router.put("/match", matchOrgan);
router.put("/status", updateOrganStatus);

module.exports = router;
