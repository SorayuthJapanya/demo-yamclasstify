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
    tyoeOfLeaf: {
      type: Number,
      required: true,
    },
    thorn: {
      type: Number,
      required: true,
    },
    trichomes: {
      type: Number,
      required: true,
    },
    tip: {
      type: Number,
      required: true,
    },
    leafBaseColor: {
      type: Number,
      required: true,
    },
    leafMiddleColor: {
      type: Number,
      required: true,
    },
    fruit: {
      type: Number,
      required: true,
    },
    shapeOfPetiole: {
      type: Number,
      required: true,
    },
    //   todo: User_id
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Classification", classificationSchema);
