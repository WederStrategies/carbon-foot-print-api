const QuestionAttempt = require("../models/QuestionAttempt");

// Record a new question attempt
const recordQuestionAttempt = async (req, res) => {
  try {
    const { name, score, questions } = req.body;

    const newAttempt = new QuestionAttempt({
      name,
      score,
      questions,
    });

    const savedAttempt = await newAttempt.save();
    res.status(201).json({
      message: "Question attempt recorded successfully",
      data: savedAttempt,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to record question attempt",
      error: error.message,
    });
  }
};

// get all question attempts
const getAllQuestionAttempts = async (req, res) => {
  try {
    const questionAttempts = await QuestionAttempt.find();
    if (questionAttempts.length === 0) {
      return res.status(404).json({ message: "Question attempt not found" });
    }
    return res.status(202).json(questionAttempts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve question attempts",
      error: error.message,
    });
  }
};

// get top 10 question attempts
const getTop10QuestionAttempts = async (req, res) => {
  try {
    const topAttempts = await QuestionAttempt.find()
      .sort({ score: -1 })
      .limit(10);

    res.status(200).json(topAttempts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching question attempts",
      error: error.message,
    });
  }
};

// Retrieve all question attempts for a user
const getQuestionAttemptsByName = async (req, res) => {
  try {
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    const attempts = await QuestionAttempt.find({ name: searchRegex });

    res.status(200).json(attempts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve question attempts",
      error: error.message,
    });
  }
};

module.exports = {
  recordQuestionAttempt,
  getQuestionAttemptsByName,
  getAllQuestionAttempts,
  getTop10QuestionAttempts,
};
