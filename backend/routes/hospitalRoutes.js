const express = require("express");
const {
  getNearbyHospitals,
  getHospitalDetails,
} = require("../services/hospitalService");

const router = express.Router();

// ✅ Get nearby hospitals (with filters)
router.get("/nearby", async (req, res) => {
  const { latitude, longitude, radius, minRating, openNow, pageToken } =
    req.query;

  try {
    const hospitals = await getNearbyHospitals(latitude, longitude, {
      radius,
      minRating,
      openNow,
      pageToken,
    });
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Get detailed info for a single hospital
router.get("/details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const details = await getHospitalDetails(id);
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
