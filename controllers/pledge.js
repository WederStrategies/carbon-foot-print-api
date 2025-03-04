const EndUser = require("../models/EndUser");
const Pledge = require("../models/Pledge");
const PledgeSummary = require("../models/PledgeSummary");
const carbonFootPrintCalculator = require("../utility/carbonFootPrintCalculator");

// Create a new plage
const createPlage = async (req, res) => {
  const data = req.body;
  const pledge = new Pledge(data);
  try {
    if (data.endUser !== undefined) {
      pledge.endUser = data.endUser;
    } else {
      const newEndUser = await EndUser.create({
        name: pledge.name,
        userId: `user-${Date.now()}`,
      });
      pledge.endUser = newEndUser._id;
    }

    const entryData = await pledge.save();

    const householdEnergy =
      carbonFootPrintCalculator.householdCarbonFootPrintCalculator(
        data.householdEnergy
      );
    const transportationMode =
      carbonFootPrintCalculator.transportationModeCarbonFootPrintCalculator(
        data.transportationMode
      );
    const dietAndFood =
      carbonFootPrintCalculator.dietAndFoodCarbonFootPrintCalculator(
        data.dietAndFood
      );
    const foodWastage =
      carbonFootPrintCalculator.foodWastageCarbonFootPrintCalculator(
        data.foodWastage
      );
    const wasteDisposal =
      carbonFootPrintCalculator.wasteDisposalCarbonFootPrintCalculator(
        data.wasteDisposal
      );
    const waterUsage =
      carbonFootPrintCalculator.waterUsageCarbonFootPrintCalculator(
        data.waterUsage
      );
    const numberOfTreesPledged = data.numberOfTreesPledged;

    const pledgeData = {
      householdEnergy,
      transportationMode,
      dietAndFood,
      foodWastage,
      wasteDisposal,
      waterUsage,
      numberOfTreesPledged,
    };

    let existingPledgeSummary = await PledgeSummary.findOne();
    if (existingPledgeSummary) {
      existingPledgeSummary.householdEnergy =
        (existingPledgeSummary.householdEnergy + pledgeData.householdEnergy) /
        2;
      existingPledgeSummary.transportationMode =
        (existingPledgeSummary.transportationMode +
          pledgeData.transportationMode) /
        2;
      existingPledgeSummary.dietAndFood =
        (existingPledgeSummary.dietAndFood + pledgeData.dietAndFood) / 2;
      existingPledgeSummary.foodWastage =
        (existingPledgeSummary.foodWastage + pledgeData.foodWastage) / 2;
      existingPledgeSummary.wasteDisposal =
        (existingPledgeSummary.wasteDisposal + pledgeData.wasteDisposal) / 2;
      existingPledgeSummary.waterUsage =
        (existingPledgeSummary.waterUsage + pledgeData.waterUsage) / 2;
      existingPledgeSummary.numberOfTrees =
        existingPledgeSummary.numberOfTrees + pledgeData.numberOfTreesPledged;

      await existingPledgeSummary.save();
    } else {
      const newSummary = new PledgeSummary({
        householdEnergy: pledgeData.householdEnergy,
        transportationMode: pledgeData.transportationMode,
        dietAndFood: pledgeData.dietAndFood,
        foodWastage: pledgeData.foodWastage,
        wasteDisposal: pledgeData.wasteDisposal,
        waterUsage: pledgeData.waterUsage,
        numberOfTrees: pledgeData.numberOfTreesPledged,
      });
      await newSummary.save();
    }

    res.status(201).json({
      message: "Plage created successfully",
      data: entryData,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to create plage", error });
  }
};

// get all plages
const getAllPlages = async (req, res) => {
  try {
    const pledges = await Pledge.find().populate("endUser");
    res.status(200).json(pledges);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve plages",
      error: error.message,
    });
  }
};

// get plage by ID
const getPlageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pledge = await Pledge.findById(id).populate("endUser");
    if (!pledge) {
      return res.status(404).json({ message: "Plage not found" });
    }
    res.status(200).json(pledge);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve plage",
      error: error.message,
    });
  }
};

// get pladge by endUser ID

const getPlageByEndUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const pledge = await Pledge.find({ endUser: id }).populate("endUser");
    if (!pledge) {
      return res.status(404).json({ message: "Plage not found" });
    }
    res.status(200).json(plage);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve plage",
      error: error.message,
    });
  }
};

// delete a plage by ID
const deletePlage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPledge = await Pledge.findByIdAndDelete(id);
    if (!deletedPledge) {
      return res.status(404).json({ message: "Plage not found" });
    }
    res.status(200).json({ message: "Plage deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete plage",
      error: error.message,
    });
  }
};

module.exports = {
  createPlage,
  getAllPlages,
  getPlageById,
  getPlageByEndUserId,
  deletePlage,
};
