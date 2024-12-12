const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const userRouter = express.Router();

//creating user route
userRouter.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  userController.createUser
);
//login user route
userRouter.post("/login", userController.loginUser);

//update user route
userRouter.patch(
  "/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  userController.updateUser
);
//get user by id
userRouter.get(
  "/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getUserById
);
//get all users
userRouter.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  userController.getAllUsers
);

// search user by name
userRouter.get(
  "/search/:name",
  authMiddleware,
  roleMiddleware("admin"),
  userController.searchUserByName
);

// delete user
userRouter.delete(
  "/userId",
  authMiddleware,
  roleMiddleware("admin"),
  userController.deleteUser
);
module.exports = userRouter;
