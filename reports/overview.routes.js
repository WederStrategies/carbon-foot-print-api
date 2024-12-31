const express = require("express");
const {
  getSummary,
  getCarbonFootprintSummary,
  getCarbonFootPrintAndPledgeSummary,
} = require("./overview.logic");

const overViewRouter = express.Router();

overViewRouter.get("/summary", getSummary);
overViewRouter.get("/carbonFootprintSummary", getCarbonFootprintSummary);
overViewRouter.get(
  "/carbonAndPledgeSummary",
  getCarbonFootPrintAndPledgeSummary
);

module.exports = overViewRouter;
