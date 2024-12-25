const mongoose = require("mongoose");

// Enums for predefined values
const CategoryEnum = ["Energy", "Water", "Waste", "Transportation", "Diet"];
const DifficultyEnum = ["General", "CarbonFootPrint", "Action"];
const LanguageEnum = ["English", "Amaharic", "Oromifa", "Tigrinya"];

// Subschema for options
const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String, required: true },
});

//Subschema for language translations
const translationSchema = new mongoose.Schema({
  language: { type: String, enum: LanguageEnum, required: true },
  question: { type: String, required: true },
  options: [OptionSchema],
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
