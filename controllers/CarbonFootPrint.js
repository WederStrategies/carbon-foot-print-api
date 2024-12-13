const CarbonFootPrint = require("../models/CarbonFootPrint");

// Create a new carbon footprint entry
const createCarbonFootprint = async (req, res) => {
  try {
    const data = req.body;
    const carbonFootprint = new CarbonFootPrint(data);
    const savedEntry = await carbonFootprint.save();
    res.status(201).json({
      message: "Carbon footprint created successfully",
      data: savedEntry,
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
    const entries = await CarbonFootPrint.find();
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
    const entry = await CarbonFootPrint.findById(id);

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

module.exports = {
  createCarbonFootprint,
  getAllCarbonFootprints,
  getCarbonFootprintById,
};
