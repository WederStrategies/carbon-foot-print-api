const CarbonFootPrint = require("../models/CarbonFootPrint");
const EndUser = require("../models/EndUser");
const carbonFootPrintCalculator = require("../utility/carbonFootPrintCalculator");

// Create a new carbon footprint entry
const createCarbonFootprint = async (req, res) => {
  try {
    const data = req.body;
    const userName = data.name;

    const newEndUser = await EndUser.create({
      name: userName,
      userId: `user-${Date.now()}`,
    });

    const { totalSum, average } =
      carbonFootPrintCalculator.totalCarbonFootPrintCalculator(data);
    const carbonFootprint = new CarbonFootPrint(data);
    carbonFootprint.endUser = newEndUser._id;

    await carbonFootprint.save(carbonFootprint);

    res.status(201).json({
      message: "Carbon footprint created successfully",
      householdEnergy:
        (carbonFootPrintCalculator.householdCarbonFootPrintCalculator(
          data.householdEnergy
        ) /
          totalSum) *
        100,
      transportationMode:
        (carbonFootPrintCalculator.transportationModeCarbonFootPrintCalculator(
          data.transportationMode
        ) /
          totalSum) *
        100,
      dietAndFood:
        (carbonFootPrintCalculator.dietAndFoodCarbonFootPrintCalculator(
          data.dietAndFood
        ) /
          totalSum) *
        100,
      foodWastage:
        (carbonFootPrintCalculator.foodWastageCarbonFootPrintCalculator(
          data.foodWastage
        ) /
          totalSum) *
        100,
      wasteDisposal:
        (carbonFootPrintCalculator.wasteDisposalCarbonFootPrintCalculator(
          data.wasteDisposal
        ) /
          totalSum) *
        100,
      waterUsage:
        (carbonFootPrintCalculator.waterUsageCarbonFootPrintCalculator(
          data.waterUsage
        ) /
          totalSum) *
        100,

      data: {
        householdEnergy:
          carbonFootPrintCalculator.householdCarbonFootPrintCalculator(
            data.householdEnergy
          ),
        transportationMode:
          carbonFootPrintCalculator.transportationModeCarbonFootPrintCalculator(
            data.transportationMode
          ),
        dietAndFood:
          carbonFootPrintCalculator.dietAndFoodCarbonFootPrintCalculator(
            data.dietAndFood
          ),
        foodWastage:
          carbonFootPrintCalculator.foodWastageCarbonFootPrintCalculator(
            data.foodWastage
          ),
        wasteDisposal:
          carbonFootPrintCalculator.wasteDisposalCarbonFootPrintCalculator(
            data.wasteDisposal
          ),
        waterusage:
          carbonFootPrintCalculator.waterUsageCarbonFootPrintCalculator(
            data.waterUsage
          ),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create carbon footprint",
      error: error.message,
    });
  }
};

// Retrieve all carbon footprint entries
const getAllCarbonFootprints = async (req, res) => {
  try {
    const entries = await CarbonFootPrint.find().populate("endUser");
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve carbon footprints",
      error: error.message,
    });
  }
};

// Retrieve a specific carbon footprint entry by ID
const getCarbonFootprintById = async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await CarbonFootPrint.findById(id).populate("endUser");

    if (!entry) {
      return res.status(404).json({ message: "Carbon footprint not found" });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve carbon footprint",
      error: error.message,
    });
  }
};

// Delete a carbon footprint entry by ID
const deleteCarbonFootprint = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await CarbonFootPrint.findByIdAndDelete(id);

    if (!deletedEntry) {
      return res.status(404).json({ message: "Carbon footprint not found" });
    }

    res.status(200).json({ message: "Carbon footprint deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete carbon footprint",
      error: error.message,
    });
  }
};

// Retrieve carbon footprint entries by endUserId
const getCarbonFootPrintByEndUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const entries = await CarbonFootPrint.find({ endUser: id }).populate(
      "endUser"
    );

    if (!entries.length) {
      return res
        .status(404)
        .json({ message: "No carbon footprints found for this user" });
    }

    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve carbon footprints",
      error: error.message,
    });
  }
};

module.exports = {
  createCarbonFootprint,
  getAllCarbonFootprints,
  getCarbonFootprintById,
  deleteCarbonFootprint,
  getCarbonFootPrintByEndUserId,
};
