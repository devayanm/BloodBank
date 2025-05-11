const DonationCamp = require("../models/DonationCamp");
const { sendCampNotification } = require("../services/notificationService");

// ✅ Create a New Donation Camp
const createCamp = async (req, res) => {
  const { name, coordinates, date, organizer, contact } = req.body;

  try {
    const camp = new DonationCamp({
      name,
      location: { type: "Point", coordinates },
      date,
      organizer,
      contact,
    });

    await camp.save();

    // ✅ Send Real-Time Notification for New Camp
    sendCampNotification(
      `📢 New donation camp: **${name}** on **${new Date(
        date
      ).toLocaleDateString()}** organized by **${organizer}**`
    );

    res.status(201).json(camp);
  } catch (error) {
    res.status(500).json({ message: "Failed to create camp" });
  }
};

// ✅ Get Nearby Camps (with Filters and Pagination)
const getNearbyCamps = async (req, res) => {
  const {
    longitude,
    latitude,
    maxDistance = 10000,
    organizer,
    date,
    page = 1,
    limit = 10,
  } = req.query;

  const query = {};

  if (organizer) query.organizer = { $regex: new RegExp(organizer, "i") };
  if (date) query.date = { $gte: new Date(date) };

  if (longitude && latitude) {
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: parseInt(maxDistance),
      },
    };
  }

  try {
    const totalCount = await DonationCamp.countDocuments(query);

    const camps = await DonationCamp.find(query)
      .sort({ date: 1 }) // Sort by upcoming dates
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      camps,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch camps" });
  }
};

// ✅ Get Detailed Info of a Single Camp
const getCampById = async (req, res) => {
  const { id } = req.params;

  try {
    const camp = await DonationCamp.findById(id);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    res.status(200).json(camp);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch camp details" });
  }
};

// ✅ Update an Existing Camp
const updateCamp = async (req, res) => {
  const { id } = req.params;
  const { name, coordinates, date, organizer, contact } = req.body;

  try {
    const camp = await DonationCamp.findById(id);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    camp.name = name || camp.name;
    camp.location = coordinates
      ? { type: "Point", coordinates }
      : camp.location;
    camp.date = date || camp.date;
    camp.organizer = organizer || camp.organizer;
    camp.contact = contact || camp.contact;

    await camp.save();

    // ✅ Send Notification for Updated Camp
    sendCampNotification(
      `🔄 Donation camp **${camp.name}** has been updated for **${new Date(
        camp.date
      ).toLocaleDateString()}**`
    );

    res.status(200).json(camp);
  } catch (error) {
    res.status(500).json({ message: "Failed to update camp" });
  }
};

// ✅ Delete a Camp
const deleteCamp = async (req, res) => {
  const { id } = req.params;

  try {
    const camp = await DonationCamp.findByIdAndDelete(id);

    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }

    // ✅ Send Notification for Deleted Camp
    sendCampNotification(
      `❌ Donation camp **${camp.name}** has been canceled.`
    );

    res.status(200).json({ message: "Camp deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete camp" });
  }
};

// ✅ Get Upcoming and Past Camps (Separated)
const getCampTimeline = async (req, res) => {
  try {
    const currentDate = new Date();

    const upcomingCamps = await DonationCamp.find({
      date: { $gte: currentDate },
    }).sort({ date: 1 });

    const pastCamps = await DonationCamp.find({
      date: { $lt: currentDate },
    }).sort({ date: -1 });

    res.status(200).json({ upcomingCamps, pastCamps });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch camp timeline" });
  }
};

module.exports = {
  createCamp,
  getNearbyCamps,
  getCampById,
  updateCamp,
  deleteCamp,
  getCampTimeline,
};
