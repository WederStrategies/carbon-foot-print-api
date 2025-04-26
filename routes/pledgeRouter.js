const express = require("express");
const {
  createPledge,
  getAllPledges,
  getPledgeSummary,
} = require("../controllers/pledgeController");

const router = express.Router();

// Route to create a new pledge
router.post("/", createPledge);

// Route to get all pledges
router.get("/", getAllPledges);

// Route to get the pledge summary
router.get("/summary", getPledgeSummary);

module.exports = router;