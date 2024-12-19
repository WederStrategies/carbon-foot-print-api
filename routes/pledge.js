const express = require("express");
const pledgeController = require("../controllers/pledge");

const pledgeRouter = express.Router();

// create a new pledge
pledgeRouter.post("/", pledgeController.createPlage);

// get all pledges
pledgeRouter.get("/", pledgeController.getAllPlages);

module.exports = pledgeRouter;
