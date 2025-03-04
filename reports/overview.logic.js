const express = require("express");
const User = require("../models/User"); // Assuming you have a User model
const Question = require("../models/Question"); // Assuming you have a Question model
const EndUser = require("../models/EndUser");
const CarbonFootprintSummary = require("../models/CarbonFootPrintSummary");
const PledgeSummary = require("../models/PledgeSummary");
const QuestionAttempt = require("../models/QuestionAttempt");

const router = express.Router();

// get total number of endUsers, Q/A and Data Managers
const getSummary = async (req, res) => {
  try {
    const totalEndUsers = await EndUser.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalDataManagers = await User.countDocuments({
      role: "data_manager",
    });

    res.json({
      totalEndUsers,
      totalQuestions,
      totalDataManagers,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCarbonFootprintSummary = async (req, res) => {
  try {
    const carbonFootprintData = await CarbonFootprintSummary.find();
    res.json(carbonFootprintData);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCarbonFootPrintAndPledgeSummary = async (req, res) => {
  try {
    const carbonFootPrintData = await CarbonFootprintSummary.find();
    const pledgeData = await PledgeSummary.find();
    // console.log(pledgeData);
    res.json({
      carbonFootPerint: carbonFootPrintData,
      pledge: pledgeData,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCorrectAnswers = async (req, res) => {
  try {
    const questionAttempts = await QuestionAttempt.find()
      .populate("questions.questionId")
      .exec();

    let generalCorrect = 0;
    let carbonFootPrintCorrect = 0;
    let actionCorrect = 0;

    questionAttempts.forEach((attempt) => {
      attempt.questions.forEach((questionAttempt) => {
        const question = questionAttempt.questionId;

        if (question !== null && question.difficulty === "General") {
          const correctOption = question.translations[0].options.find(
            (option) => option.isCorrect === true
          );
          if (
            correctOption &&
            correctOption._id.toString() === questionAttempt.answerId
          ) {
            generalCorrect++;
          }
        } else if (
          question !== null &&
          question.difficulty === "CarbonFootPrint"
        ) {
          const correctOption = question.translations[0].options.find(
            (option) => option.isCorrect === true
          );
          if (
            correctOption &&
            correctOption._id.toString() === questionAttempt.answerId
          ) {
            carbonFootPrintCorrect++;
          }
        } else if (question !== null && question.difficulty === "Action") {
          const correctOption = question.translations[0].options.find(
            (option) => option.isCorrect === true
          );
          if (
            correctOption &&
            correctOption._id.toString() === questionAttempt.answerId
          ) {
            actionCorrect++;
          }
        }
      });
    });
    res.status(200).json({
      General: generalCorrect,
      CarbonFootPrint: carbonFootPrintCorrect,
      Action: actionCorrect,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getSummary,
  getCarbonFootprintSummary,
  getCarbonFootPrintAndPledgeSummary,
  getCorrectAnswers,
};
