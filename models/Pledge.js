const mongoose = require("mongoose");

// Enums for predefined values
const HousingTypeEnum = ["Apartment", "Condo", "Townhouse"];
const RecycleEnum = ["Yes", "No"];

// Subschemas for Household Energy
const HeatingAndCoolingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["electric", "charcoal", "none"],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

const CookingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["electric", "charcoal", "gas", "wood", "dont use any"],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

const ElectricApplianceSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["tv", "washingMachine", "iron", "refrigerator"],
  },
  hourlyUsagePerDay: { type: Number, required: true },
  frequencyperWeek: { type: Number, default: 7, required: true },
});

const LightBulbSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["incandescent", "cfl", "led", "fluorescent"],
  },
  hourlyUsagePerDay: { type: Number, required: true },
});

// Subschemas for Transportation
const TransportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["gasPowered", "electricPowered", "hybrid"],
  },
  distance: { type: Number, required: true },
  frequencyperWeek: { type: Number, required: true },
});

// Subschemas for Transportation
const PublicTransportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["bus", "taxi", "train", "ride"],
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
const PledgeSchema = new mongoose.Schema(
  {
    endUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndUser",
      required: true,
    },
    name: { type: String, required: true },
    housingType: { type: String, required: true, enum: HousingTypeEnum },
    householdEnergy: {
      heatingAndCooling: [HeatingAndCoolingSchema],
      cooking: [CookingSchema],
      electricAppliance: [ElectricApplianceSchema],
      lightBulbs: [LightBulbSchema],
    },
    transportationMode: {
      ownAutomobile: [TransportSchema],
      publicTransport: [PublicTransportSchema],
      bicycle: [TransportSchemaBicycle],
      walking: [TransportSchemaBicycle],
    },
    dietAndFood: {
      poultry: { dailyUsage: { type: Number } },
      vegetable: { dailyUsage: { type: Number } },
      meat: { dailyUsage: { type: Number } },
      fish: { dailyUsage: { type: Number } },
    },
    foodWastage: { type: Number },
    wasteDisposal: {
      weeklyCollection: { frequency: { type: Number } },
      recycleHabit: { type: String, enum: RecycleEnum },
    },
    waterUsage: WaterUsageSchema,
    numberOfTreesPledged: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pledge", PledgeSchema);
