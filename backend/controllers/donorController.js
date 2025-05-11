const asyncHandler = require("express-async-handler");
const Donor = require("../models/Donor");
const User = require("../models/User");

// @desc    Register/Update donor profile
// @route   POST /api/donors
// @access  Private
const registerDonor = asyncHandler(async (req, res) => {
  const { body, user } = req;

  const donorData = {
    user: user._id,
    address: body.address,
    location: {
      type: "Point",
      coordinates: body.coordinates,
    },
    availabilityStatus: body.availabilityStatus,
    lastDonationDate: body.lastDonationDate,
    preferredDonationTypes: body.preferredDonationTypes,
    healthDeclaration: body.healthDeclaration,
  };

  const options = {
    new: true,
    upsert: true,
    runValidators: true,
  };

  const donor = await Donor.findOneAndUpdate(
    { user: user._id },
    donorData,
    options
  );

  await User.findByIdAndUpdate(user._id, {
    $addToSet: { roles: "donor" },
    bloodType: body.bloodType,
  });

  res.status(201).json({
    _id: donor._id,
    availabilityStatus: donor.availabilityStatus,
    lastDonationDate: donor.lastDonationDate,
    location: donor.location,
  });
});

// @desc    Get nearby available donors
// @route   GET /api/donors/nearby?lat=&lng=&maxDistance=
// @access  Public
const getNearbyDonors = asyncHandler(async (req, res) => {
  const { lat, lng } = req.query;

  const donors = await Donor.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        // $maxDistance: parseInt(maxDistance),
      },
    },
    availabilityStatus: { $in: ["Available", "Emergency"] },
  }).populate("user", "name bloodType");

  res.json(donors);
});

module.exports = { registerDonor, getNearbyDonors };
