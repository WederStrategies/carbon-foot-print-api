const mongoose = require("mongoose")

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
  },
  { timestamps: true }
)

module.exports = mongoose.model("EndUser", EndUserSchema)
