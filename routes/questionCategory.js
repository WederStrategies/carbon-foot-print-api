const express = require("express");
const {
  createQuestionCategory,
  getAllQuestionCategories,
  getQuestionCategoryById,
  updateQuestionCategory,
  deleteQuestionCategory,
} = require("../controllers/QuestionCategory");

const questionCategoryRouter = express.Router();

questionCategoryRouter.post("/", createQuestionCategory);
questionCategoryRouter.get("/", getAllQuestionCategories);
questionCategoryRouter.get("/:id", getQuestionCategoryById);
questionCategoryRouter.put("/:id", updateQuestionCategory);
questionCategoryRouter.delete("/:id", deleteQuestionCategory);

module.exports = questionCategoryRouter;
