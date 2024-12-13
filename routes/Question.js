const express = require("express");
const questionController = require("../controllers/Question");
const questionRouter = express.Router();

// create a new quesiton
questionRouter.post("/", questionController.createQuestion);

// get all questions
questionRouter.get("/", questionController.getAllQuestions);

// get question by id
questionRouter.get("/:id", questionController.getQuestionById);

module.exports = questionRouter;
