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
const getWeeklyWasteDispoalFrequency = async (req, res) => {
  try {
    const data = await CarbonFootPrint.find(
      {},
      "wasteDisposal.weeklyCollection.frequency"
    );
    console.log(data);
    const frequencyCounts = {};
    data.forEach((record) => {
      const frequency = record?.wasteDisposal?.weeklyCollection?.frequency || 0;
      if (frequencyCounts[frequency]) {
        frequencyCounts[frequency]++;
      } else {
        frequencyCounts[frequency] = 1;
      }
    });
    res.json(frequencyCounts);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

// get recycle material count
const getRecycleMaterialCount = async (req, res) => {
  try {
    const data = await CarbonFootPrint.aggregate([
      { $unwind: "$wasteDisposal.recycleMaterials" },
      {
        $group: {
          _id: "$wasteDisposal.recycleMaterials",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const materialCounts = data.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json(materialCounts);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
};

// count house-hold usage type
const getHouseHoldUsage = async (req, res) => {
  try {
    const heatingAndCoolingResult = await CarbonFootPrint.aggregate([
      {
        $unwind: "$householdEnergy.heatingAndCooling",
      },
      {
        $group: {
          _id: "$householdEnergy.heatingAndCooling.type",
          count: { $sum: 1 },
        },
      },
    ]);

    const heatingAndCoolingFormatted = heatingAndCoolingResult.reduce(
      (acc, item) => {
        acc[item._id.charAt(0).toUpperCase() + item._id.slice(1)] = item.count;
        return acc;
      },
      {}
    );
    const cookingResult = await CarbonFootPrint.aggregate([
      {
        $unwind: "$householdEnergy.cooking",
      },
      {
        $group: {
          _id: "$householdEnergy.cooking.type",
          count: { $sum: 1 },
        },
      },
    ]);

    const cookingFormatted = cookingResult.reduce((acc, item) => {
      acc[item._id.charAt(0).toUpperCase() + item._id.slice(1)] = item.count;
      return acc;
    }, {});
    const electricApplianceResult = await CarbonFootPrint.aggregate([
      {
        $unwind: "$householdEnergy.electricAppliance",
      },
      {
        $group: {
          _id: "$householdEnergy.electricAppliance.type",
          count: { $sum: 1 },
        },
      },
    ]);
    const electricApplianceFormatted = electricApplianceResult.reduce(
      (acc, item) => {
        acc[item._id.charAt(0).toUpperCase() + item._id.slice(1)] = item.count;
        return acc;
      },
      {}
    );
    const lightBulbResult = await CarbonFootPrint.aggregate([
      {
        $unwind: "$householdEnergy.lightBulbs",
      },
      {
        $group: {
          _id: "$householdEnergy.lightBulbs.type",
          count: { $sum: 1 },
        },
      },
    ]);

    const lightBulbFormatted = lightBulbResult.reduce((acc, item) => {
      acc[item._id.charAt(0).toUpperCase() + item._id.slice(1)] = item.count;
      return acc;
    }, {});
    res.json({
      success: true,
      data: {
        heatingAndCooling: heatingAndCoolingFormatted,
        cooking: cookingFormatted,
        electricAppliances: electricApplianceFormatted,
        lightBulbs: lightBulbFormatted,
      },
    });
  } catch (error) {
    console.error("Error counting usage types:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// count transportation mode usage
const getTransportationModeUsage = async (req, res) => {
  try {
    const transportationResult = await CarbonFootPrint.aggregate([
      {
        $unwind: "$transportationMode.ownAutomobile",
      },
      {
        $group: {
          _id: "$transportationMode.ownAutomobile.type",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "$_id",
          count: 1,
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            { $unwind: "$transportationMode.publicTransport" },
            {
              $group: {
                _id: "$transportationMode.publicTransport.type",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            { $unwind: "$transportationMode.bicycle" },
            {
              $group: {
                _id: "bicycle",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            { $unwind: "$transportationMode.walking" },
            {
              $group: {
                _id: "walking",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);
    const result = {
      publicTransport: {},
      ownAutomobile: {},
      bicycle: 0,
      walking: 0,
    };
    transportationResult.forEach((item) => {
      if (
        item.type === "bus" ||
        item.type === "taxi" ||
        item.type === "train" ||
        item.type === "ride"
      ) {
        result.publicTransport[item.type] = item.count;
      } else if (
        item.type === "gasPowered" ||
        item.type === "electricPowered" ||
        item.type === "hybrid"
      ) {
        result.ownAutomobile[item.type] = item.count;
      } else if (item.type === "bicycle") {
        result.bicycle = item.count;
      } else if (item.type === "walking") {
        result.walking = item.count;
      }
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error counting transportation modes:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// get total water usage
const getTotalWaterUsage = async (req, res) => {
  try {
    const totalWaterUsage = await CarbonFootPrint.aggregate([
      {
        $group: {
          _id: "$waterUsage.washingClothes.frequencyperWeek",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "washingClothes",
          frequency: "$_id",
          count: 1,
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            {
              $group: {
                _id: "$waterUsage.showers.daysPerWeek",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "showers",
                daysPerWeek: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            {
              $group: {
                _id: "$waterUsage.gardenWatering.daysPerWeek",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "gardenWatering",
                daysPerWeek: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = {
      washingClothes: 0,
      showers: 0,
      gardenWatering: 0,
    };
    totalWaterUsage.forEach((item) => {
      if (item.type === "washingClothes") {
        result.washingClothes += item.count;
      } else if (item.type === "showers") {
        result.showers += item.count;
      } else if (item.type === "gardenWatering") {
        result.gardenWatering += item.count;
      }
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error counting water usage:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// get average frequency for water usage activities
const getAverageWaterUsageFrequency = async (req, res) => {
  try {
    const averageWaterUsage = await CarbonFootPrint.aggregate([
      {
        $group: {
          _id: "$waterUsage.washingClothes.frequencyperWeek",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          type: "washingClothes",
          frequency: "$_id",
          count: 1,
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            {
              $group: {
                _id: "$waterUsage.showers.daysPerWeek",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "showers",
                daysPerWeek: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
      {
        $unionWith: {
          coll: "carbonfootprints",
          pipeline: [
            {
              $group: {
                _id: "$waterUsage.gardenWatering.daysPerWeek",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                type: "gardenWatering",
                daysPerWeek: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);

    const result = {
      washingClothes: 0,
      showers: 0,
      gardenWatering: 0,
    };

    let washingClothesTotal = 0;
    let showersTotal = 0;
    let gardenWateringTotal = 0;
    let washingClothesCount = 0;
    let showersCount = 0;
    let gardenWateringCount = 0;

    averageWaterUsage.forEach((item) => {
      if (item.type === "washingClothes") {
        washingClothesTotal += item.frequency * item.count;
        washingClothesCount += item.count;
      } else if (item.type === "showers") {
        showersTotal += item.daysPerWeek * item.count;
        showersCount += item.count;
      } else if (item.type === "gardenWatering") {
        gardenWateringTotal += item.daysPerWeek * item.count;
        gardenWateringCount += item.count;
      }
    });

    result.washingClothes = washingClothesTotal / washingClothesCount || 0;
    result.showers = showersTotal / showersCount || 0;
    result.gardenWatering = gardenWateringTotal / gardenWateringCount || 0;

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error calculating average water usage:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getSummary,
  listDietAndFoodResults,
  getWeeklyWasteDispoalFrequency,
  getRecycleMaterialCount,
  getHouseHoldUsage,
  getTransportationModeUsage,
  getTotalWaterUsage,
  getAverageWaterUsageFrequency,
};
