const express = require("express");
const questionController = require("../controllers/Question");
const questionRouter = express.Router();

// create a new quesiton
questionRouter.post("/", questionController.createQuestion);

// get all questions
questionRouter.get("/", questionController.getAllQuestions);

module.exports = questionRouter;
