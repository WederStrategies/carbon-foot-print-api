const CarbonFootPrint = require("../models/CarbonFootPrint");
const CarbonFootPrintSummary = require("../models/CarbonFootPrintSummary");
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

    const carbonFootPrintData = {
      householdEnergy,
      transportationMode,
      dietAndFood,
      foodWastage,
      wasteDisposal,
      waterUsage,
    };

    let existingSummary = await CarbonFootPrintSummary.findOne();

    if (existingSummary) {
      existingSummary.householdEnergy =
        (existingSummary.householdEnergy +
          carbonFootPrintData.householdEnergy) /
        2;
      existingSummary.transportationMode =
        (existingSummary.transportationMode +
          carbonFootPrintData.transportationMode) /
        2;
      existingSummary.dietAndFood =
        (existingSummary.transportationMode + carbonFootPrintData.dietAndFood) /
        2;
      existingSummary.foodWastage =
        (existingSummary.foodWastage + carbonFootPrintData.foodWastage) / 2;
      existingSummary.wasteDisposal =
        (existingSummary.wasteDisposal + carbonFootPrintData.wasteDisposal) / 2;
      existingSummary.waterUsage =
        (existingSummary.waterUsage + carbonFootPrintData.waterUsage) / 2;
      await existingSummary.save();
    } else {
      const newSummary = new CarbonFootPrintSummary({
        householdEnergy: carbonFootPrintData.householdEnergy,
        transportationMode: carbonFootPrintData.transportationMode,
        dietAndFood: carbonFootPrintData.dietAndFood,
        foodWastage: carbonFootPrintData.foodWastage,
        wasteDisposal: carbonFootPrintData.wasteDisposal,
        waterUsage: carbonFootPrintData.waterUsage,
      });
      await newSummary.save();
    }

    res.status(201).json({
      message: "Carbon footprint created successfully",
      householdEnergy: (householdEnergy / totalSum) * 100,
      transportationMode: (transportationMode / totalSum) * 100,
      dietAndFood: (dietAndFood / totalSum) * 100,
      foodWastage: (foodWastage / totalSum) * 100,
      wasteDisposal: (wasteDisposal / totalSum) * 100,
      waterUsage: (waterUsage / totalSum) * 100,
      data: carbonFootPrintData,
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

    res.status(200).json({
      value: entries[0],
      data: {
        householdEnergy:
          carbonFootPrintCalculator.householdCarbonFootPrintCalculator(
            entries[0].householdEnergy
          ),
        transportationMode:
          carbonFootPrintCalculator.transportationModeCarbonFootPrintCalculator(
            entries[0].transportationMode
          ),
        dietAndFood:
          carbonFootPrintCalculator.dietAndFoodCarbonFootPrintCalculator(
            entries[0].dietAndFood
          ),
        foodWastage:
          carbonFootPrintCalculator.foodWastageCarbonFootPrintCalculator(
            entries[0].foodWastage
          ),
        wasteDisposal:
          carbonFootPrintCalculator.wasteDisposalCarbonFootPrintCalculator(
            entries[0].wasteDisposal
          ),
        waterusage:
          carbonFootPrintCalculator.waterUsageCarbonFootPrintCalculator(
            entries[0].waterUsage
          ),
      },
    });
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
