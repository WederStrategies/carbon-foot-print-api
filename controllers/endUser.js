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
    //date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0); // Set time to 12:00 AM of the current day
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    const endUsers = await EndUser.find({
      createdAt: { $gte: date },
      //hasPledged: false,
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

// get list of end users that create a carbon foot print entry starting at 8:00 AM of the current day
/*const getEndUsersFromToday = async (req, res) => {
  try {
    console.log("end user - from today");
    const date = new Date();
    date.setHours(8, 0, 0, 0); // Set time to 8:00 AM of the current day
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    const endUsers = await EndUser.find({
      createdAt: { $gte: date },
      name: searchRegex,
    });
    console.log("end user - from today", endUsers);
    res.status(200).json(endUsers);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve end users",
      error: error.message,
    });
  }
};*/
const getEndUsersFromToday = async (req, res) => {
  try {
    console.log("end user - from today");
    const date = new Date();
    date.setHours(8, 0, 0, 0); // Set time to 8:00 AM of the current day
    const search = req.query.search || "";
    const searchRegex = new RegExp(search, "i");
    const endUsers = await EndUser.find({
      createdAt: { $gte: date },
      name: searchRegex,
    });
    console.log("end user - from today", endUsers);

    // Return a structured response
    const names = endUsers.map((user) => user.name);
    res.status(200).json({ names });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve end users",
      error: error.message,
    });
  }
};

// update end user data
const updateEnduserData = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNumber } = req.body;

    const enduser = await EndUser.findById(id);
    if (!enduser) {
      return res.status(404).json({ message: "End user not found" });
    }
    if (enduser)
      if (name) {
        enduser.name = name;
      }
    (enduser.email = email), (enduser.phoneNumber = phoneNumber);
    const updateEnduser = await enduser.save();
    res.status(201).json(updateEnduser);
  } catch (error) {
    res.status(500).json({
      message: "Faild to update end user",
      error: error.message,
    });
  }
};

// Backend route to update end user
const updateHasPledged = async (req, res) => {
  try {
    const { id } = req.params;
    const { hasPledged } = req.body;
    // Validate the input 
    const user = await EndUser.findById(id);
    if (user)
    {
      console.log("user", user);
    }

    const updatedUser = await EndUser.findByIdAndUpdate(
      id,
      { hasPledged },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

module.exports = {
  getEndUsers,
  getEndUsersForLast24Hours,
  getEndUsersFromToday, // Added new function to exports
  geteEndUsersByid,
  updateEnduserData,
  updateHasPledged,
};
