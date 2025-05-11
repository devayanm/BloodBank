const mongoose = require("mongoose");

const donationCampSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    date: { type: Date, required: true },
    organizer: { type: String, required: true },
    contact: { type: String },
  },
  { timestamps: true }
);

donationCampSchema.index({ location: "2dsphere" }); // Geo index for location-based search

const DonationCamp = mongoose.model("DonationCamp", donationCampSchema);

module.exports = DonationCamp;
