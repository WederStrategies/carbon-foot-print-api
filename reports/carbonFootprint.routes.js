const express = require("express");
const { getSummary } = require("./carbonFootprint.logic");

const carbonFootprintRouter = express.Router();

carbonFootprintRouter.get("/summary", getSummary);

module.exports = carbonFootprintRouter;
