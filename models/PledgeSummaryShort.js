const mongoose = require("mongoose");

const PledgeSummaryShortSchema = new mongoose.Schema(
  {
    endUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndUser", // Reference to the EndUser model
      required: true,
    },
    name: {
      type: String, // Name of the person making the pledge
      required: false, // Optional
    },
    email: {
      type: String, // Email of the person making the pledge
      required: false, // Optional
    },
    phoneNumber: {
      type: String, // Phone number of the person making the pledge
      required: false, // Optional
    },
    numberOfTreesPledged: {
      type: Number,
      required: true, // Number of trees pledged by the user
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PledgeSummaryShort", PledgeSummaryShortSchema);