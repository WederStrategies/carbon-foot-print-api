const express = require("express");
const CarbonFootPrint = require("../models/CarbonFootPrint");

const getSummary = async (req, res) => {
  try {
    const totalGuests = await CarbonFootPrint.countDocuments();

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    // console.log(today);

    const startOfWeek = new Date(today);
    // console.log(startOfWeek);
    startOfWeek.setDate(today.getDate() - today.getDay());
    // console.log(startOfWeek);
    const guestsToday = await CarbonFootPrint.countDocuments({
      createdAt: { $gte: today },
    });

    const guestsThisWeek = await CarbonFootPrint.countDocuments({
      createdAt: { $gte: startOfWeek },
    });

    res.status(200).json({
      totalGuests: totalGuests,
      guestsToday: guestsToday,
      guestsThisWeek: guestsThisWeek,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSummary };
