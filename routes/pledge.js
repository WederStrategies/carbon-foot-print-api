const express = require("express");
const pledgeController = require("../controllers/pledge");

const pledgeRouter = express.Router();

// create a new pledge
pledgeRouter.post("/", pledgeController.createPlage);

// get all pledges
pledgeRouter.get("/", pledgeController.getAllPlages);
//get pledge by endUser ID
pledgeRouter.get("/endUser/:id", pledgeController.getPlageByEndUserId);

// get pledge by ID
pledgeRouter.get("/:id", pledgeController.getPlageById);

module.exports = pledgeRouter;
