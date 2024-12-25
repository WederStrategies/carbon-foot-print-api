const express = require("express");
const questionController = require("../controllers/Question");
const questionRouter = express.Router();

// create a new quesiton
questionRouter.post("/", questionController.createQuestion);

// send random questions by categories
questionRouter.post("/rnd", questionController.getRandomQuestionsByCategories);

// get all questions
questionRouter.get("/", questionController.getAllQuestions);

// get question by id
questionRouter.get("/:id", questionController.getQuestionById);

// update question by id
questionRouter.patch("/:id", questionController.updateQuestion);

// delte question by id
questionRouter.delete("/:id", questionController.deleteQuestion);

// add a new translation to an existing quesion
questionRouter.patch(
  "/translate/:id",
  questionController.addTranslationToQuestion
);

module.exports = questionRouter;
