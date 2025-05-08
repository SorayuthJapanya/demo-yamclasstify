const mongoose = require("mongoose");

const speciesSchema = mongoose.Schema(
  {
    imageUrl: {
      data: Buffer,
      contentType: String,
    },
    commonName: {
      type: String,
      required: true,
    },
    localName: {
      type: String,
      required: true,
    },
    scientificName: {
      type: String,
      required: true,
      unique: true,
    },
    familyName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    propagation: {
      type: String,
    },
    plantingseason: {
      type: String,
    },
    harvestingseason: {
      type: String,
    },
    utilization: {
      type: String,
    },
    status: {
      type: String,
    },
    surveysite: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Species", speciesSchema);
