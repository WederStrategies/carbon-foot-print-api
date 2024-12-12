const mongoose = require("mongoose");

// Enums for predefined values
const HousingTypeEnum = ["Apartment", "Condo", "Townhouse"];
const RecycleEnum = ["Yes", "No"];

// Subschemas for Household Energy
const HeatingAndCoolingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Electric", "charcoal", "dont use any "],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

const CookingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Electric", "charcoal", "dont use any"],
  },
  hourlyUsagePerDay: { type: Number },
});

const ElectricApplianceSchema = new mongoose.Schema({
  type: { type: String, enum: ["Tv", "Washing", "Iron"] },
  hourlyUsagePerDay: { type: Number },
});

const LightBulbSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Light Bulbs", "Solar"],
  },
  hourlyUsagePerDay: { type: Number },
});

// Subschemas for Transportation
const TransportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["gas powered", "electric powered"],
  },
  distance: { type: Number },
  frequencyperWeek: { type: Number },
});
const TransportSchemaBicycle = new mongoose.Schema({
  distance: { type: Number },
  frequencyperWeek: { type: Number },
});

// Subschema for Water Usage
const WaterUsageSchema = new mongoose.Schema({
  washingClothes: { frequencyperWeek: { type: Number } },
  showers: {
    daysPerWeek: { type: Number },
    averageDuration: { type: Number },
  },
  gardenWatering: {
    daysPerWeek: { type: Number },
    averageDuration: { type: Number },
  },
});

// Main Schema
const CarbonFootprintSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Anonymous" },
    housingType: { type: String, required: true, enum: HousingTypeEnum },
    householdEnergy: {
      heatingAndCooling: [HeatingAndCoolingSchema],
      cooking: [CookingSchema],
      electricAppliance: [ElectricApplianceSchema],
      lightBulbs: [LightBulbSchema],
    },
    transportationMode: {
      ownAutomobile: [TransportSchema],
      publicTransport: [TransportSchema],
      bicycle: [TransportSchemaBicycle],
      walking: [TransportSchemaBicycle],
    },
    dietAndFood: {
      poultry: { dailyUsage: { type: Number } },
      vegetable: { dailyUsage: { type: Number } },
      meat: { dailyUsage: { type: Number } },
      fish: { dailyUsage: { type: Number } },
    },
    wasteDisposal: { type: Number },
    foodWastage: {
      weeklyCollection: { frequency: { type: Number } },
      recycleHabit: { type: String, enum: RecycleEnum },
    },
    waterUsage: WaterUsageSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarbonFootprint", CarbonFootprintSchema);
