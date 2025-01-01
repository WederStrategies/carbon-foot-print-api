const express = require("express");
const {
  getSummary,
  listDietAndFoodResults,
  listWasteDisposalResults,
} = require("./carbonFootprint.logic");

const carbonFootprintRouter = express.Router();

carbonFootprintRouter.get("/summary", getSummary);
carbonFootprintRouter.get("/dietAndFood", listDietAndFoodResults);
carbonFootprintRouter.get("/wasteDisposal", listWasteDisposalResults);

module.exports = carbonFootprintRouter;
