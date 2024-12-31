const express = require("express");
const User = require("../models/User"); // Assuming you have a User model
const Question = require("../models/Question"); // Assuming you have a Question model
const EndUser = require("../models/EndUser");
const CarbonFootprintSummary = require("../models/CarbonFootPrintSummary");
const PledgeSummary = require("../models/PledgeSummary");

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
    res.json({
      carbonFootPerint: carbonFootPrintData,
      pledge: pledgeData,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSummary,
  getCarbonFootprintSummary,
  getCarbonFootPrintAndPledgeSummary,
};
