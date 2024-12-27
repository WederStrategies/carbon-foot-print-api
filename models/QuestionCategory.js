const mongoose = require("mongoose");

const QuestionCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuestionCategory", QuestionCategorySchema);
