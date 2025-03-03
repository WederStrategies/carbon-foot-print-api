const mongoose = require("mongoose");

const CarbonFootPrintSummarySchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CarbonFootPrintSummary",
  CarbonFootPrintSummarySchema
);
