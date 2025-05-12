const OrganDonor = require("../models/OrganDonor");

exports.getAllOrganDonors = async (req, res) => {
  // Parse range for pagination
  let range = [0, 9];
  if (req.query.range) {
    try {
      range = JSON.parse(req.query.range);
    } catch {}
  }
  const [start, end] = range;
  const limit = end - start + 1;

  const total = await OrganDonor.countDocuments();
  const donors = await OrganDonor.find()
    .skip(start)
    .limit(limit)
    .populate("user", "name email");

  // Add id field for React Admin
  const donorsWithId = donors.map((d) => ({ ...d.toObject(), id: d._id }));

  // Set Content-Range header
  res.set(
    "Content-Range",
    `organ-donors ${start}-${start + donorsWithId.length - 1}/${total}`
  );
  res.json(donorsWithId);
};

exports.getOrganDonor = async (req, res) => {
  const donor = await OrganDonor.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json({ data: { ...donor.toObject(), id: donor._id } });
};

exports.createOrganDonor = async (req, res) => {
  const donor = await OrganDonor.create(req.body);
  res.status(201).json(donor);
};

exports.updateOrganDonor = async (req, res) => {
  const donor = await OrganDonor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json(donor);
};

exports.deleteOrganDonor = async (req, res) => {
  const donor = await OrganDonor.findByIdAndDelete(req.params.id);
  if (!donor) return res.status(404).json({ message: "Donor not found" });
  res.json({ message: "Donor deleted" });
};
