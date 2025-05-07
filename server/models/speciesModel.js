const mongoose = require("mongoose");

const speciesSchema = mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
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
      required: true,
    },
  },
  { timeStamp: true }
);

module.exports = mongoose.model("Species", speciesSchema);
