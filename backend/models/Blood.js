const mongoose = require("mongoose");

const bloodSchema = new mongoose.Schema({
  bloodType: {
    type: String,
    required: true,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  quantity: { type: Number, required: true },
  location: { type: String },
  expiryDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now },
});

const Blood = mongoose.model("Blood", bloodSchema);
module.exports = Blood;
