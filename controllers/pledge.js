const EndUser = require("../models/EndUser");
const Pledge = require("../models/Pledge");

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
