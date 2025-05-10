const Classification = require("../models/classificationModel");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose")

exports.getHistortById = async (req, res) => {
  try {
    const { _id } = req.params;

    const classificationHistory = await Classification.find({ userId: _id });
    if (!classificationHistory || classificationHistory.length === 0) {
      return res.status(404).json({ message: "Your history not found" });
    }

    res.status(200).json(classificationHistory);
  } catch (error) {
    console.log("Error in getHistortById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateHistoryById = async (req, res) => {
  try {
    const { _id } = req.params;
    const { latitude, longitude } = req.body;

    // Validate _id
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(400).json({ message: "Invalid history ID" });
    }

    const history = await Classification.findById(_id);
    if (!history) {
      return res.status(404).json({ message: "Your history not found" });
    }

    // Update fields if provided
    if (latitude) history.latitude = latitude;
    if (longitude) history.longitude = longitude;

    const updatedHistory = await history.save();

    res
      .status(200)
      .json({ message: "Updated GPS successfully", history: updatedHistory });
  } catch (error) {
    console.error("Error in updateHistoryById controller:", error.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.deleteHistortById = async (req, res) => {
  try {
    const { _id } = req.params;

    const history = await Classification.findByIdAndDelete(_id);
    if (!history)
      return res.status(404).json({ message: "Your history not found" });

    if (history.imageUrl) {
      const imagePath = path.join(__dirname, "../uploads", history.imageUrl);
      fs.unlink(imagePath, (err) => {
        if (err) return console.log("Error Delete image file");
      });
    }

    await Classification.findByIdAndDelete(_id);
    res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    console.log("Error in deleteHistortById controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
