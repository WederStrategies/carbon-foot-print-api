const mongoose = require("mongoose");

const EndUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: `user ${Date.now()}`,
    },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EndUser", EndUserSchema);
