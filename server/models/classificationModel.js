const mongoose = require("mongoose");

const classificationSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    predicted: {
      type: String,
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "USER",
      required: true,
    },
    latitude: {
      type: Number,
      default: null,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      deffault: null,
      min: -180,
      max: 180,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classification", classificationSchema);
