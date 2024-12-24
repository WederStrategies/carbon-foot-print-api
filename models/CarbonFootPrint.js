const mongoose = require("mongoose");

// Enums for predefined values
const HousingTypeEnum = ["apartment", "condo", "vila", "hut"];
const RecycleEnum = ["yes", "no"];
const RecycleMaterialsEnum = ["paper", "plastic", "bottle", "metal"];

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
const CarbonFootprintSchema = new mongoose.Schema(
  {
    endUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndUser",
      required: true,
    },
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
      poultry: { weeklyUsage: { type: Number } },
      vegetable: { weeklyUsage: { type: Number } },
      meat: { weeklyUsage: { type: Number } },
      fish: { weeklyUsage: { type: Number } },
    },
    foodWastage: { type: Number },
    wasteDisposal: {
      weeklyCollection: { frequency: { type: Number } },
      recycleHabit: {
        type: String,
        enum: RecycleEnum,
      },
      recycleMaterials: {
        type: [String],
        enum: RecycleMaterialsEnum,
        validate: {
          validator: function (value) {
            if (
              this.wasteDisposal.recycleHabit === "yes" &&
              (!value || value.length === 0)
            ) {
              return false;
            }
            if (
              this.wasteDisposal.recycleHabit === "no" &&
              value &&
              value.length > 0
            ) {
              return false;
            }
            return true;
          },
          message:
            "Please select at least one recycling material if you recycle, or leave it empty if you don't.",
        },
      },
    },
    waterUsage: WaterUsageSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("CarbonFootprint", CarbonFootprintSchema);
