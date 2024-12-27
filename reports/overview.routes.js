const express = require("express");
const { getSummary } = require("./overview.logic");

const overViewRouter = express.Router();

overViewRouter.get("/summary", getSummary);

module.exports = overViewRouter;
