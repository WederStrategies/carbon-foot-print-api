const express = require("express");
const questionController = require("../controllers/Question");
const questionRouter = express.Router();

// create a new quesiton
questionRouter.post("/", questionController.createQuestion);

module.exports = questionRouter;
