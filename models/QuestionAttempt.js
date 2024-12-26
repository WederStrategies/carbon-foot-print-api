const mongoose = require("mongoose");
const Question = require("./Question");

const QuestionAttemptSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    questions: [
      {
        questionId: {
          type: mongoose.Schema.ObjectId,
          ref: Question,
          required: true,
        },
        answerId: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionAttempt", QuestionAttemptSchema);
