// bloodRoutes.js
const express = require("express");
const { bloodLimiter } = require("../middlewares/rateLimiter");
const bloodController = require("../controllers/bloodController");

const router = express.Router();

// Use the full object reference
router.get("/", bloodLimiter, bloodController.getBloodStock);
router.get("/statistics", bloodController.getBloodStatistics);
router.get("/:bloodType", bloodController.getBloodStockByType);
router.post("/update", bloodController.updateBloodStock);
router.delete("/delete", bloodController.deleteBloodStock);

module.exports = router;
