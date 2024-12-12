const mongoose = require("mongoose");

// Enums for predefined values
const EnergyTypeEnum = ["electric", "charcoal", "gas", "solar"];
const HousingTypeEnum = ["Apartment", "Detached House", "Townhouse"];
const TransportTypeEnum = ["gas powered", "electric powered"];
const RecycleEnum = ["Yes", "No"];

// Subschemas
const EnergySchema = new mongoose.Schema({
  type: { type: String, required: true, enum: EnergyTypeEnum },
  value: { type: String, required: true },
});

const TransportSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: TransportTypeEnum },
  distance: { type: String, required: true },
  usagePerWeek: { type: String, required: true },
});

const WaterUsageSchema = new mongoose.Schema({
  washingClothes: { type: Number, required: true },
  showers: {
    daysPerWeek: { type: Number, required: true },
    averageDuration: { type: Number, required: true },
  },
  gardenWatering: { type: Number, required: false },
});

// Main Schema
const CarbonFootprintSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    housingType: { type: String, required: true, enum: HousingTypeEnum },
    householdEnergy: {
      heatingAndCooling: [EnergySchema],
      cooking: [EnergySchema],
      electricAppliance: [EnergySchema],
      lightBulbs: [EnergySchema],
    },
    transportationMode: {
      ownAutomobile: [TransportSchema],
      publicTransport: [TransportSchema],
      bicycle: [TransportSchema],
      walking: [TransportSchema],
    },
    dietAndFood: {
      poultry: { type: String },
      vegetable: { type: String },
      meat: { type: String },
      fish: { type: String },
    },
    wasteDisposal: { type: String },
    foodWastage: {
      weeklyCollection: { type: Number, required: true },
      recycleHabit: { type: String, required: true, enum: RecycleEnum },
    },
    waterUsage: WaterUsageSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarbonFootprint", CarbonFootprintSchema);
