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

// ger carbon foot print by end user id

carbonFootPrintRouter.get(
  "/enduser/:id",
  carbonFootPrintController.getCarbonFootPrintByEndUserId
);
// get carbon foot prints by id
carbonFootPrintRouter.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  carbonFootPrintController.getCarbonFootprintById
);

// delete carbon foot prints by id
carbonFootPrintRouter.delete(
  "/:id",
  carbonFootPrintController.deleteCarbonFootprint
);

module.exports = carbonFootPrintRouter;
