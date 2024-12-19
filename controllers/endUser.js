const EndUser = require("../models/EndUser");

// get all end users
const getEndUsers = async (req, res) => {
  try {
    console.log("end user");
    const endUsers = await EndUser.find();
    res.status(200).json(endUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve end users",
      error: error.message,
    });
  }
};

// get end user by id
const geteEndUsersByid = async (req, res) => {
  try {
    const endUsers = await EndUser.findById(req.params.id);
    res.status(200).json(endUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve end users",
      error: error.message,
    });
  }
};

// get list of end users that create a carbon foot print entry for last 24 hours
const getEndUsersForLast24Hours = async (req, res) => {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    const endUsers = await EndUser.find({
      createdAt: { $gte: date },
      name: searchRegex,
    });

    res.status(200).json(endUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve end users",
      error: error.message,
    });
  }
};

module.exports = {
  getEndUsers,
  getEndUsersForLast24Hours,
  geteEndUsersByid,
};
