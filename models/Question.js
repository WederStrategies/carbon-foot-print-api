const mongoose = require("mongoose");

// Enums for predefined values
const DifficultyEnum = ["Easy", "Medium", "Difficult"];

// Subschema for options
const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
  explanation: { type: String },
});

//Subschema for language translations
const translationSchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
  },
  question: { type: String, required: true },
  options: [OptionSchema],
});

// Main schema for questions
const QuestionSchema = new mongoose.Schema(
  {
    // category: { type: String, required: true },
    difficulty: { type: String, required: true, enum: DifficultyEnum },
    translations: [translationSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", QuestionSchema);
