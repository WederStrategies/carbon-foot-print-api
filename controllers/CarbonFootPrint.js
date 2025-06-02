const CarbonFootPrint = require("../models/CarbonFootPrint");
const CarbonFootPrintSummary = require("../models/CarbonFootPrintSummary");
const EndUser = require("../models/EndUser");
const carbonFootPrintCalculator = require("../utility/carbonFootPrintCalculator");

// Create a new carbon footprint entry
const createCarbonFootprint = async (req, res) => {
  try {
    console.log("API called: createCarbonFootprint"); // Log API call
    const data = req.body;
    console.log("Request body:", data); // Log request body

    const userName = data.name;
    console.log("Extracted userName:", userName); // Log extracted user name

    // Check for duplicate entry
    const duplicateEntry = await CarbonFootPrint.findOne({
      endUser: data.endUser,
      householdEnergy: data.householdEnergy,
      transportationMode: data.transportationMode,
      dietAndFood: data.dietAndFood,
      foodWastage: data.foodWastage,
      wasteDisposal: data.wasteDisposal,
      waterUsage: data.waterUsage,
    });

    if (duplicateEntry) {
      console.log("Duplicate entry found, ignoring request."); // Log duplicate entry
      return res.status(200).json({
        message: "Duplicate carbon footprint entry detected. Request ignored.",
      });
    }

    const newEndUser = await EndUser.create({
      name: userName,
      userId: `user-${Date.now()}`,
    });
    console.log("New end user created:", newEndUser); // Log new end user creation

    const { totalSum, average } =
      carbonFootPrintCalculator.totalCarbonFootPrintCalculator(data);
    console.log("Total carbon footprint calculated:", { totalSum, average }); // Log total carbon footprint calculation

    const carbonFootprint = new CarbonFootPrint(data);
    carbonFootprint.endUser = newEndUser._id;

    await carbonFootprint.save(carbonFootprint);
    console.log("Carbon footprint saved:", carbonFootprint); // Log saved carbon footprint

    const householdEnergy =
      carbonFootPrintCalculator.householdCarbonFootPrintCalculator(
        carbonFootprint.householdEnergy
      ).toFixed(0);
    console.log("Household energy carbon footprint:", householdEnergy); // Log household energy calculation

    const transportationMode =
      carbonFootPrintCalculator.transportationModeCarbonFootPrintCalculator(
        carbonFootprint.transportationMode
      ).toFixed(0);
    console.log("Transportation mode carbon footprint:", transportationMode); // Log transportation mode calculation

    const dietAndFood =
      carbonFootPrintCalculator.dietAndFoodCarbonFootPrintCalculator(
        carbonFootprint.dietAndFood
      ).toFixed(0);
    console.log("Diet and food carbon footprint:", dietAndFood); // Log diet and food calculation

    const foodWastage =
      carbonFootPrintCalculator.foodWastageCarbonFootPrintCalculator(
        carbonFootprint.foodWastage
      ).toFixed(0);
    console.log("Food wastage carbon footprint:", foodWastage); // Log food wastage calculation

    const wasteDisposal =
      carbonFootPrintCalculator.wasteDisposalCarbonFootPrintCalculator(
        carbonFootprint.wasteDisposal
      ).toFixed(0);
    console.log("Waste disposal carbon footprint:", wasteDisposal); // Log waste disposal calculation

    const waterUsage =
      carbonFootPrintCalculator.waterUsageCarbonFootPrintCalculator(
        carbonFootprint.waterUsage
      ).toFixed(0);
    console.log("Water usage carbon footprint:", waterUsage); // Log water usage calculation

    const carbonFootPrintData = {
      householdEnergy,
      transportationMode,
      dietAndFood,
      foodWastage,
      wasteDisposal,
      waterUsage,
    };
    console.log("Carbon footprint data:", carbonFootPrintData); // Log aggregated carbon footprint data

    /**/

    res.status(201).json({
      message: "Carbon footprint created successfully",
      
      data: carbonFootPrintData,
    });
    console.log("Response sent successfully"); // Log successful response
  } catch (error) {
    console.error("Error in createCarbonFootprint:", error.message); // Log error
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
          ).toFixed(0),
        transportationMode:
          carbonFootPrintCalculator.transportationModeCarbonFootPrintCalculator(
            entries[0].transportationMode
          ).toFixed(0),
        dietAndFood:
          carbonFootPrintCalculator.dietAndFoodCarbonFootPrintCalculator(
            entries[0].dietAndFood
          ).toFixed(0),
        foodWastage:
          carbonFootPrintCalculator.foodWastageCarbonFootPrintCalculator(
            entries[0].foodWastage
          ).toFixed(0),
        wasteDisposal:
          carbonFootPrintCalculator.wasteDisposalCarbonFootPrintCalculator(
            entries[0].wasteDisposal
          ).toFixed(0),
        waterusage:
          carbonFootPrintCalculator.waterUsageCarbonFootPrintCalculator(
            entries[0].waterUsage
          ).toFixed(0),
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
