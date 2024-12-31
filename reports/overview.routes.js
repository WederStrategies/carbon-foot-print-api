const express = require("express");
const { getSummary, getCarbonFootprintSummary } = require("./overview.logic");

const overViewRouter = express.Router();

overViewRouter.get("/summary", getSummary);
overViewRouter.get("/carbonFootprintSummary", getCarbonFootprintSummary);

module.exports = overViewRouter;
