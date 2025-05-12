const asyncHandler = require("express-async-handler");
const OrganDonor = require("../models/OrganDonor");

// Register or update organ donor
const registerOrganDonor = asyncHandler(async (req, res) => {
  const { organ, location, urgency, trust, contact, address, notes } = req.body;
  const user = req.user;

  const donorData = {
    user: user._id,
    organ,
    location,
    urgency,
    trust,
    contact,
    address,
    notes,
    verified: false, // can be set by admin later
  };

  const donor = await OrganDonor.findOneAndUpdate(
    { user: user._id },
    donorData,
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json(donor);
});

// Get nearby organ donors
const getNearbyOrganDonors = asyncHandler(async (req, res) => {
  const { lat, lng, organ } = req.query;
  let query = {};
  if (lat && lng) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
      },
    };
  }
  if (organ) query.organ = organ;

  console.log("Query:", query);
  const donors = await OrganDonor.find(query).populate("user", "name");
  console.log("Donors found:", donors.length);
  res.json(donors);
});

module.exports = { registerOrganDonor, getNearbyOrganDonors };
