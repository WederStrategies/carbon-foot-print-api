const express = require("express");
const CarbonFootPrint = require("../models/CarbonFootPrint");

const getSummary = async (req, res) => {
  try {
    const totalGuests = await CarbonFootPrint.countDocuments();

    const today = new Date();

    today.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
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

const listDietAndFoodResults = async (req, res) => {
  try {
    const results = await CarbonFootPrint.aggregate([
      { $project: { _id: 0, dietAndFood: 1 } },
    ]);

    const summedData = {
      poultry: { totalUsage: 0, count: 0 },
      vegetable: { totalUsage: 0, count: 0 },
      meat: { totalUsage: 0, count: 0 },
      fish: { totalUsage: 0, count: 0 },
    };

    results.forEach((item) => {
      const diet = item.dietAndFood;

      if (diet.poultry) {
        summedData.poultry.totalUsage += diet.poultry.weeklyUsage;
        summedData.poultry.count += 1;
      }
      if (diet.vegetable) {
        summedData.vegetable.totalUsage += diet.vegetable.weeklyUsage;
        summedData.vegetable.count += 1;
      }
      if (diet.meat) {
        summedData.meat.totalUsage += diet.meat.weeklyUsage;
        summedData.meat.count += 1;
      }
      if (diet.fish) {
        summedData.fish.totalUsage += diet.fish.weeklyUsage;
        summedData.fish.count += 1;
      }
    });

    const averagedData = {
      poultry: summedData.poultry.count
        ? summedData.poultry.totalUsage / summedData.poultry.count
        : 0,
      vegetable: summedData.vegetable.count
        ? summedData.vegetable.totalUsage / summedData.vegetable.count
        : 0,
      meat: summedData.meat.count
        ? summedData.meat.totalUsage / summedData.meat.count
        : 0,
      fish: summedData.fish.count
        ? summedData.fish.totalUsage / summedData.fish.count
        : 0,
    };

    res.status(200).json({ averageWeaklyUsage: averagedData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// weekly waste disposal frequency
const listWasteDisposalResults = async (req, res) => {
  try {
    const results = await CarbonFootPrint.aggregate([
      { $project: { _id: 0, wasteDisposal: 1 } },
    ]);
    const summedWasteData = {
      totalCollectionFrequency: 0,
      count: 0,
      recycleHabitYesCount: 0,
      recycleHabitNoCount: 0,
    };
    results.forEach((item) => {
      const waste = item.wasteDisposal;
      if (waste && waste.weeklyCollection && waste.weeklyCollection.frequency) {
        summedWasteData.totalCollectionFrequency +=
          waste.weeklyCollection.frequency;
        summedWasteData.count += 1;
      }
      if (waste) {
        if (waste.recycleHabit === "yes") {
          summedWasteData.recycleHabitYesCount += 1;
        } else if (waste.recycleHabit === "no") {
          summedWasteData.recycleHabitNoCount += 1;
        }
      }
    });

    const averagedWasteData = {
      averageCollectionFrequency: summedWasteData.count
        ? summedWasteData.totalCollectionFrequency / summedWasteData.count
        : 0,
      recycleHabitYesPercent: summedWasteData.count
        ? (summedWasteData.recycleHabitYesCount / summedWasteData.count) * 100
        : 0,
      recycleHabitNoPercent: summedWasteData.count
        ? (summedWasteData.recycleHabitNoCount / summedWasteData.count) * 100
        : 0,
    };

    res.status(200).json({ averagedWasteData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSummary,
  listDietAndFoodResults,
  listWasteDisposalResults,
};
