const EndUser = require("../models/EndUser");
const Plage = require("../models/Pledge");

// Create a new plage
const createPlage = async (req, res) => {
  const data = req.body;
  const plage = new Plage(data);
  try {
    console.log(data.endUser);
    if (data.endUser !== undefined) {
      plage.endUser = data.endUser;
    } else {
      const newEndUser = await EndUser.create({
        name: `user-${Date.now()}`,
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

module.exports = { createPlage };
