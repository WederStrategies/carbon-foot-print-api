const express = require("express");
const {
  getSummary,
  getCarbonFootprintSummary,
  getCarbonFootPrintAndPledgeSummary,
  getCorrectAnswers,
} = require("./overview.logic");

const overViewRouter = express.Router();

overViewRouter.get("/summary", getSummary);
overViewRouter.get("/carbonFootprintSummary", getCarbonFootprintSummary);
overViewRouter.get(
  "/carbonAndPledgeSummary",
  getCarbonFootPrintAndPledgeSummary
);
overViewRouter.get("/correctAnswers", getCorrectAnswers);

module.exports = overViewRouter;
