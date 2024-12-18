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
  },
  { timestamps: true }
);

module.exports = mongoose.model("EndUser", EndUserSchema);
