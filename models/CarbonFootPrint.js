const mongoose = require("mongoose");

// Enums for predefined values
const HousingTypeEnum = ["Apartment", "Condo", "Townhouse"];
const RecycleEnum = ["Yes", "No"];

// Subschemas for Household Energy
const HeatingAndCoolingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Electric", "charcoal", "dont use any "],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

const CookingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Electric", "charcoal", "dont use any"],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

const ElectricApplianceSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["Tv", "Washing", "Iron"] },
  hourlyUsagePerDay: { type: Number, required: true },
});

const LightBulbSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Light Bulbs", "Solar"],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

// Subschemas for Transportation
const TransportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["gas powered", "electric powered"],
  },
  distance: { type: Number, required: true },
  frequencyperWeek: { type: Number, required: true },
});
const TransportSchemaBicycle = new mongoose.Schema({
  distance: { type: Number, required: true },
  frequencyperWeek: { type: Number, required: true },
});

// Subschema for Water Usage
const WaterUsageSchema = new mongoose.Schema({
  washingClothes: { frequencyperWeek: { type: Number, required: true } },
  showers: {
    daysPerWeek: { type: Number, required: true },
    averageDuration: { type: Number, required: true },
  },
  gardenWatering: {
    daysPerWeek: { type: Number, required: true },
    averageDuration: { type: Number, required: true },
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
