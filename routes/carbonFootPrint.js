const express = require("express");
const carbonFootPrintController = require("../controllers/carbonFootPrint");
const CarbonFootPrint = require("../models/CarbonFootPrint");
const carbonFootPrintRouter = express.Router();

// create carbon foot print
carbonFootPrintRouter.post(
  "/",
  carbonFootPrintController.createCarbonFootprint
);

module.exports = carbonFootPrintRouter;
