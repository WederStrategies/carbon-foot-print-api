const express = require("express");
const carbonFootPrintController = require("../controllers/carbonFootPrint");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const carbonFootPrintRouter = express.Router();

// create a new carbon foot print
carbonFootPrintRouter.post(
  "/",
  carbonFootPrintController.createCarbonFootprint
);

// get all carbon foot print
carbonFootPrintRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  carbonFootPrintController.getAllCarbonFootprints
);

module.exports = carbonFootPrintRouter;
