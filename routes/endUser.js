const express = require("express");
const endUserController = require("../controllers/endUser");

const endUserRouter = express.Router();

// Get end users for the last 24 hours
endUserRouter.get("/last24hours", endUserController.getEndUsersForLast24Hours);

// Get end users from today
endUserRouter.get("/today", endUserController.getEndUsersFromToday);

// Get end user by ID
endUserRouter.get("/:id", endUserController.geteEndUsersByid);

// Get all end users
endUserRouter.get("/", endUserController.getEndUsers);

// update end user data

endUserRouter.patch("/:id", endUserController.updateEnduserData);

//patch end user
endUserRouter.patch("/:id/pledge",endUserController.updateHasPledged);

module.exports = endUserRouter;
