const express = require("express");
const {
  getSummary,
  listDietAndFoodResults,
  getWeeklyWasteDispoalFrequency,
  getRecycleMaterialCount,
  getHouseHoldUsage,
  getTransportationModeUsage,
  getTotalWaterUsage,
  getAverageWaterUsageFrequency,
} = require("./carbonFootprint.logic");

const carbonFootprintRouter = express.Router();

carbonFootprintRouter.get("/summary", getSummary);
carbonFootprintRouter.get("/dietAndFood", listDietAndFoodResults);
carbonFootprintRouter.get("/wasteDisposal", getWeeklyWasteDispoalFrequency);
carbonFootprintRouter.get("/recycleMaterial", getRecycleMaterialCount);
carbonFootprintRouter.get("/houseHoldusage", getHouseHoldUsage);
carbonFootprintRouter.get("/transportationMode", getTransportationModeUsage);
carbonFootprintRouter.get("/WaterUsage", getTotalWaterUsage);
carbonFootprintRouter.get("/WaterUsageDuration", getAverageWaterUsageFrequency);

module.exports = carbonFootprintRouter;
