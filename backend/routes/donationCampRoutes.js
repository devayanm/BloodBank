const express = require("express");
const {
  createCamp,
  getNearbyCamps,
  getCampById,
  updateCamp,
  deleteCamp,
  getCampTimeline,
} = require("../controllers/donationCampController");

const router = express.Router();

router.post("/create", createCamp);
router.get("/", getNearbyCamps);
router.get("/:id", getCampById);
router.put("/:id", updateCamp);
router.delete("/:id", deleteCamp);
router.get("/timeline", getCampTimeline);

module.exports = router;
