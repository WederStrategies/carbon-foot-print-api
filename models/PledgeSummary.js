const mongoose = require("mongoose");

const PledgeSummarySchema = new mongoose.Schema(
  {
    householdEnergy: {
      type: Number,
      default: 0,
    },
    transportationMode: {
      type: Number,
      default: 0,
    },
    dietAndFood: {
      type: Number,
      default: 0,
    },
    foodWastage: {
      type: Number,
      default: 0,
    },
    wasteDisposal: {
      type: Number,
      default: 0,
    },
    waterUsage: {
      type: Number,
      default: 0,
    },
    numberOfTrees: {
      type: Number,
      default: 0,
    },
    numberOfPeople: {
      type: Number,
      default: 0, // Tracks the number of people who pledged
    },
    totalTreesPledged: {
      type: Number,
      default: 0, // Tracks the total number of trees pledged
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PledgeSummary", PledgeSummarySchema);
