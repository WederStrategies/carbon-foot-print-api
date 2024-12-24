const mongoose = require("mongoose");

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionAttempt", QuestionAttemptSchema);
