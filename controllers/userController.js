const User = require("../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const isValidEmail = require("../utility/validateEmail");
require("dotenv/config");

const createUser = async (req, res) => {
  let { name, email, password, role } = req.body;
  console.log(req.body);

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "all fileds are required" });
    }

    if (password && password.length < 7) {
      return res
        .status(400)
        .json({ error: "Min password length should be atleast 7" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const getUserByEmail = await User.find({ email });
    if (getUserByEmail.length) {
      return res.status(400).json({ error: "A User exist by this email" });
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound);
    const user = await User.create({
      name: name,
      email: email,
      role: role,
      password: passwordHash,
    });
    const userData = _.pick(user, ["_id", "email", "role"]);
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
    res.header("x-auth", `Bearer ${accessToken}`).json({
      success: true,
      token: `Bearer ${accessToken}`,
      user: {
        id: user._id,
        name,
        email,
        role: user.role,
      },
    });
  } catch (err) {
    console.log({ error: err });
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  let { email, password } = _.pick(req.body, ["email", "password"]);
  try {
    if (!password || !email) {
      return res
        .status(400)
        .json({ error: "Password and email are required!" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const user = await User.find({ email });
    if (!user.length) {
      return res.status(400).json({ error: "User not found!" });
    }
    const isValid = await bcrypt.compare(password, user[0].password);

    if (!isValid) {
      return res.status(401).json({ error: "password incorrect" });
    }

    const updatedUser = await user[0].save();
    const userData = _.pick(user[0], ["_id", "email", "role"]);
    const accessToken = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET);
    res.header("x-auth", `Bearer ${accessToken}`).json({
      success: true,
      token: `Bearer ${accessToken}`,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (err) {
    console.log({ error: err });
    res.status(500).json({ Error: "Internal Server Error" });
  }
};
const updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !role) {
      return res.status(400).json({ error: "all fields are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findById({ _id: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    user.name = name;
    user.email = email;
    user.role = role;

    if (password) {
      if (password.length < 7) {
        return res
          .status(400)
          .json({ error: "Min password length should be at least 7" });
      }
      const saltRound = 10;
      user.password = await bcrypt.hash(password, saltRound);
    }

    const updatedUser = await user.save();
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.userId }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchUserByName = async (req, res) => {
  try {
    const { name } = req.query;

    console.log(req.query);
    const regex = new RegExp(name, "i");
    const users = await User.find({ name: regex });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const find = await User.findById({ _id: req.params.userId });
    if (!find) {
      return res.status(404).json({ error: "user not found" });
    }
    await User.deleteOne({ _id: req.params.userId });
    res.status(204).json({ success: true, message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  getUserById,
  searchUserByName,
  deleteUser,
  getAllUsers,
};
