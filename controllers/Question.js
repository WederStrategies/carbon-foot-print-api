const Question = require("../models/Question");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: "Failed to create question", error });
  }
};

module.exports = {
  createQuestion,
};
