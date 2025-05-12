const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organDonorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    organ: {
      type: String,
      required: true,
      enum: [
        "Kidney",
        "Liver",
        "Heart",
        "Lung",
        "Pancreas",
        "Intestine",
        "Other",
      ],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    urgency: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
    },
    verified: { type: Boolean, default: false },
    trust: {
      type: String,
      enum: ["Bronze", "Silver", "Gold", "Platinum"],
      default: "Bronze",
    },
    contact: { type: String }, // phone 
    address: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

organDonorSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("OrganDonor", organDonorSchema);
