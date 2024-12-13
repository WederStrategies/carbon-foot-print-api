const CarbonFootPrint = require("../models/CarbonFootPrint");

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

module.exports = {
  createCarbonFootprint,
};
