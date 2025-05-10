const express = require("express");
const router = express.Router();

// import controller
const {
  getHistortById,
  updateHistoryById,
  deleteHistortById,
} = require("../controllers/historyController");

// import middleware
const { protectRoute } = require("../middleware/authMiddleware");

router.get("/get-history/:_id", protectRoute, getHistortById);
router.put("/update-history/:_id", protectRoute, updateHistoryById);
router.delete("/delete-history/:_id", protectRoute, deleteHistortById);

module.exports = router;
