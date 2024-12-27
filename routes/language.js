const express = require("express");
const {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
} = require("../controllers/Language");

const languageRouter = express.Router();

languageRouter.post("/", createLanguage);
languageRouter.get("/", getAllLanguages);
languageRouter.get("/:id", getLanguageById);
languageRouter.put("/:id", updateLanguage);
languageRouter.delete("/:id", deleteLanguage);

module.exports = languageRouter;
