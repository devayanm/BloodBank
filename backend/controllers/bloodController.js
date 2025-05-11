const Blood = require("../models/Blood");
const { sendNotification } = require("../services/notificationService");

// ✅ Get All Blood Stock (with Filters and Pagination)
const getBloodStock = async (req, res) => {
  const {
    bloodType,
    minQuantity,
    maxQuantity,
    location,
    page = 1,
    limit = 10,
  } = req.query;
  const query = {};

  if (bloodType) query.bloodType = bloodType;
  if (minQuantity) query.quantity = { $gte: parseInt(minQuantity) };
  if (maxQuantity)
    query.quantity = { ...query.quantity, $lte: parseInt(maxQuantity) };
  if (location) query.location = { $regex: new RegExp(location, "i") };

  try {
    const totalCount = await Blood.countDocuments(query);

    const stock = await Blood.find(query)
      .sort({ lastUpdated: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      totalCount,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalCount / limit),
      stock,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blood stock" });
  }
};

// ✅ Get Detailed Blood Stock Info (Single Blood Type)
const getBloodStockByType = async (req, res) => {
  const { bloodType } = req.params;

  try {
    const stock = await Blood.findOne({ bloodType });

    if (!stock) {
      return res.status(404).json({ message: "Blood type not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blood stock info" });
  }
};

// ✅ Update or Add Blood Stock
const updateBloodStock = async (req, res) => {
  const { bloodType, quantity, location, expiryDate } = req.body;

  try {
    let stock = await Blood.findOne({ bloodType, location });

    if (stock) {
      stock.quantity += quantity;
      stock.expiryDate = expiryDate || stock.expiryDate;
      stock.lastUpdated = Date.now();
    } else {
      stock = new Blood({ bloodType, quantity, location, expiryDate });
    }

    await stock.save();

    // ✅ Trigger Low Stock Notification
    if (stock.quantity <= 5) {
      sendNotification(`Low stock for blood type ${bloodType} at ${location}`);
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blood stock" });
  }
};

// ✅ Delete Blood Stock Entry
const deleteBloodStock = async (req, res) => {
  const { bloodType, location } = req.body;

  try {
    const stock = await Blood.findOneAndDelete({ bloodType, location });

    if (!stock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    res.status(200).json({ message: "Blood stock entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blood stock" });
  }
};

// ✅ Remove Expired Blood Stock Automatically
const removeExpiredBloodStock = async () => {
  try {
    const currentDate = new Date();

    const result = await Blood.deleteMany({
      expiryDate: { $lte: currentDate },
    });

    if (result.deletedCount > 0) {
      console.log(`${result.deletedCount} expired blood stocks removed`);
    }
  } catch (error) {
    console.error("Failed to remove expired blood stock", error);
  }
};

// ✅ Get Blood Stock Statistics (For Dashboard)
const getBloodStatistics = async (req, res) => {
  try {
    const totalStock = await Blood.aggregate([
      {
        $group: {
          _id: "$bloodType",
          totalQuantity: { $sum: "$quantity" },
          count: { $sum: 1 },
        },
      },
    ]);

    const lowStock = await Blood.find({ quantity: { $lte: 5 } }).count();

    res.status(200).json({
      totalStock,
      lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blood statistics" });
  }
};

module.exports = {
  getBloodStock,
  getBloodStockByType,
  updateBloodStock,
  deleteBloodStock,
  removeExpiredBloodStock,
  getBloodStatistics,
};
