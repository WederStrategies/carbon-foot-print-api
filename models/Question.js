const mongoose = require("mongoose");

// Enums for predefined values
const CategoryEnum = ["Energy", "Water", "Waste", "Transportation", "Diet"];
const DifficultyEnum = ["Easy", "Medium", "Hard"];
const LanguageEnum = ["English", "Amaharic", "Oromifa", "Tigrinya"];

// Subschema for options
const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String },
});

// Main schema for questions
const QuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [OptionSchema], required: true },
    category: { type: String, required: true, enum: CategoryEnum },
    language: { type: String, required: true, enum: LanguageEnum },
    difficulty: { type: String, required: true, enum: DifficultyEnum },
    explanation: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
