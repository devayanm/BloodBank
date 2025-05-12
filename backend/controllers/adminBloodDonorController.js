const BloodDonor = require("../models/Donor");

exports.getAllBloodDonors = async (req, res) => {
  let range = [0, 9];
  if (req.query.range) {
    try {
      range = JSON.parse(req.query.range);
    } catch {}
  }
  const [start, end] = range;
  const limit = end - start + 1;

  const total = await BloodDonor.countDocuments();
  const donors = await BloodDonor.find()
    .skip(start)
    .limit(limit)
    .populate("user", "name email bloodType");

  const donorsWithId = donors.map((d) => ({ ...d.toObject(), id: d._id }));

  res.set(
    "Content-Range",
    `blood-donors ${start}-${start + donorsWithId.length - 1}/${total}`
  );
  res.json(donorsWithId);
};

exports.getBloodDonor = async (req, res) => {
  const donor = await BloodDonor.findById(req.params.id).populate(
    "user",
    "name email bloodType"
  );
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json({ data: { ...donor.toObject(), id: donor._id } });
};

exports.createBloodDonor = async (req, res) => {
  const donor = await BloodDonor.create(req.body);
  res.status(201).json(donor);
};

exports.updateBloodDonor = async (req, res) => {
  const donor = await BloodDonor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json(donor);
};

exports.deleteBloodDonor = async (req, res) => {
  const donor = await BloodDonor.findByIdAndDelete(req.params.id);
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json({ message: "Donor deleted" });
};
