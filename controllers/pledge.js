const EndUser = require("../models/EndUser");
const Plage = require("../models/Pledge");

// Create a new plage
const createPlage = async (req, res) => {
  const data = req.body;
  const plage = new Plage(data);
  try {
    if (data.endUser !== undefined) {
      plage.endUser = data.endUser;
    } else {
      const newEndUser = await EndUser.create({
        name: plage.name,
        userId: `user-${Date.now()}`,
      });
      plage.endUser = newEndUser._id;
    }

    const entryData = await plage.save();

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
    const plages = await Plage.find().populate("endUser");
    res.status(200).json(plages);
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
    const plage = await Plage.findById(id).populate("endUser");
    res.status(200).json(plage);
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
    const plage = await Plage.find({ endUser: id }).populate("endUser");
    res.status(200).json(plage);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve plage",
      error: error.message,
    });
  }
};

module.exports = {
  createPlage,
  getAllPlages,
  getPlageById,
  getPlageByEndUserId,
};
