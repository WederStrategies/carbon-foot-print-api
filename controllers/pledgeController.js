const PledgeSummaryShort = require("../models/PledgeSummaryShort");
const PledgeSummary = require("../models/PledgeSummary");

// Create a new pledge
const createPledge = async (req, res) => {
  try {
    const { endUser, name, email, phoneNumber, numberOfTreesPledged } = req.body;

    // Create a new pledge entry
    const newPledge = await PledgeSummaryShort.create({
      endUser,
      name,
      email,
      phoneNumber,
      numberOfTreesPledged,
    });

    // Update the overall pledge summary
    const summary = await PledgeSummary.findOne();
    if (summary) {
      summary.numberOfPeople += 1;
      summary.totalTreesPledged += numberOfTreesPledged;
      await summary.save();
    } else {
      await PledgeSummary.create({
        numberOfPeople: 1,
        totalTreesPledged: numberOfTreesPledged,
      });
    }

    res.status(201).json({
      message: "Pledge created successfully",
      pledge: newPledge,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create pledge",
      error: error.message,
    });
  }
};

// Get all pledges
const getAllPledges = async (req, res) => {
  try {
    const pledges = await PledgeSummaryShort.find().populate("endUser", "name email");
    res.status(200).json(pledges);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve pledges",
      error: error.message,
    });
  }
};

// Get pledge summary
const getPledgeSummary = async (req, res) => {
  try {
    const summary = await PledgeSummary.findOne();
    if (!summary) {
      return res.status(404).json({
        message: "No pledge summary found",
      });
    }
    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve pledge summary",
      error: error.message,
    });
  }
};

module.exports = {
  createPledge,
  getAllPledges,
  getPledgeSummary,
};