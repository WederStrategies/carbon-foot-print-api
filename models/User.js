const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    role: {
      type: String,
      enum: ["data_manager", "admin"],
      default: "data_manager",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("users", UserSchema)
