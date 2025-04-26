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
      unique: false,
      default: "text@gmail.com",
    },
    phoneNumber: {
      type: String,
      unique: false,
      default: "00",
    },
    hasPledged: {
      type: Boolean,
      default: false, // Indicates whether the user has pledged or not
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EndUser", EndUserSchema);
