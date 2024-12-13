const mongoose = require("mongoose");

// Enums for predefined values
const CategoryEnum = ["Energy", "Water", "Waste", "Transportation", "Diet"];
const DifficultyEnum = ["Easy", "Medium", "Hard"];
const LanguageEnum = ["English", "Amaharic", "Oromifa", "Tigrinya"];

// Subschema for options
const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

//Subschema for language translations
const translationSchema = new mongoose.Schema({
  language: { type: String, enum: LanguageEnum, required: true },
  question: { type: String, required: true },
  options: [OptionSchema],
  explanation: { type: String },
});

// Main schema for questions
const QuestionSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: CategoryEnum },
    difficulty: { type: String, required: true, enum: DifficultyEnum },
    translations: [translationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
