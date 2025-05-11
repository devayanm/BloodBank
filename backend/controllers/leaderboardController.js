const Leaderboard = require("../models/Leaderboard");
const User = require("../models/User");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find()
      .populate("userId", "name bloodType")
      .sort({ totalDonations: -1 })
      .limit(10);

    res.status(200).json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

const updateLeaderboard = async (userId) => {
  const user = await User.findById(userId);

  if (user) {
    await Leaderboard.findOneAndUpdate(
      { userId },
      { name: user.name, totalDonations: user.totalDonations },
      { upsert: true }
    );
  }
};

module.exports = { getLeaderboard, updateLeaderboard };
