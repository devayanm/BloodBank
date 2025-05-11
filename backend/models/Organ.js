const mongoose = require("mongoose");

const organSchema = new mongoose.Schema(
  {
    organType: {
      type: String,
      required: true,
      enum: ["Kidney", "Liver", "Heart", "Lung", "Pancreas", "Intestine"],
    },
    bloodType: { type: String, required: true },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["Available", "Matched", "Transplanted", "Expired"],
      default: "Available",
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    consentProvided: { type: Boolean, required: true },
    matchedAt: { type: Date },
  },
  { timestamps: true }
);

organSchema.index({ location: "2dsphere" }); // For geo-based search

const Organ = mongoose.model("Organ", organSchema);
module.exports = Organ;
