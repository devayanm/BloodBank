const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    contact: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v) =>
            v.length === 2 &&
            v[0] >= -180 &&
            v[0] <= 180 &&
            v[1] >= -90 &&
            v[1] <= 90,
          message: "Invalid coordinates",
        },
      },
    },
    availabilityStatus: {
      type: String,
      enum: ["Available", "Unavailable", "Emergency"],
      default: "Available",
    },
    lastDonationDate: {
      type: Date,
      validate: {
        validator: (v) => v <= Date.now(),
        message: "Future dates not allowed",
      },
    },
    preferredDonationTypes: [
      {
        type: String,
        enum: ["Whole Blood", "Plasma", "Platelets"],
      },
    ],
    healthDeclaration: {
      recentTravel: Boolean,
      currentMedications: [String],
      chronicConditions: [String],
    },
  },
  { timestamps: true }
);

donorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Donor", donorSchema);
