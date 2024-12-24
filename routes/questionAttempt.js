const express = require("express");
const questionAttemptController = require("../controllers/QuestionAttempt");

const questionAttemptRouter = express.Router();

questionAttemptRouter.post(
  "/",
  questionAttemptController.recordQuestionAttempt
);
questionAttemptRouter.get("/", questionAttemptController.getAllQuesionAttempts);
questionAttemptRouter.get(
  "/top10",
  questionAttemptController.getTop10QuestionAttempts
);
questionAttemptRouter.get(
  "/name",
  questionAttemptController.getQuestionAttemptsByName
);

module.exports = questionAttemptRouter;
