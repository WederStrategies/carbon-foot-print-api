const data = {
  name: "Kebede",
  housingType: "apartment",
  householdEnergy: {
    heatingAndCooling: [
      {
        type: "electric",
        hourlyUsagePerDay: 6,
      },
      {
        type: "charcoal",
        hourlyUsagePerDay: 2,
      },
    ],
    cooking: [
      {
        type: "electric",
        hourlyUsagePerDay: 3,
      },
    ],
    electricAppliance: [
      {
        type: "tv",
        hourlyUsagePerDay: 4,
      },
      {
        type: "washingMachine",
        hourlyUsagePerDay: 1.5,
        frequencyperWeek: 2,
      },
      {
        type: "iron",
        hourlyUsagePerDay: 1.5,
        frequencyperWeek: 2,
      },
    ],
    lightBulbs: [
      {
        type: "incandescent",
        hourlyUsagePerDay: 5,
      },
      {
        type: "cfl",
        hourlyUsagePerDay: 2,
      },
      {
        type: "led",
        hourlyUsagePerDay: 2,
      },
      {
        type: "fluorescent",
        hourlyUsagePerDay: 2,
      },
    ],
  },
  transportationMode: {
    ownAutomobile: [
      {
        type: "gasPowered",
        distance: 50,
        frequencyperWeek: 5,
      },
      {
        type: "electricPowered",
        distance: 50,
        frequencyperWeek: 5,
      },
    ],
    publicTransport: [
      {
        type: "bus",
        distance: 30,
        frequencyperWeek: 3,
      },
      {
        type: "taxi",
        distance: 30,
        frequencyperWeek: 3,
      },
      {
        type: "train",
        distance: 30,
        frequencyperWeek: 3,
      },
      {
        type: "ride",
        distance: 30,
        frequencyperWeek: 3,
      },
    ],
    bicycle: [
      {
        distance: 10,
        frequencyperWeek: 4,
      },
    ],
    walking: [
      {
        distance: 5,
        frequencyperWeek: 7,
      },
    ],
  },
  dietAndFood: {
    poultry: {
      weeklyUsage: 0.2,
    },
    vegetable: {
      weeklyUsage: 0.5,
    },
    meat: {
      weeklyUsage: 0.3,
    },
    fish: {
      weeklyUsage: 0.1,
    },
  },
  foodWastage: 15,
  wasteDisposal: {
    weeklyCollection: {
      frequency: 2,
    },
    recycleHabit: "yes",
    recycleMaterials: ["plastic", "paper", "metal"],
  },
  waterUsage: {
    washingClothes: {
      frequencyperWeek: 3,
    },
    showers: {
      daysPerWeek: 7,
      averageDuration: 10,
    },
    gardenWatering: {
      daysPerWeek: 3,
      averageDuration: 15,
    },
  },
};

const year = 365;
const week = 52;
const electricCarbonEmitedKgPerKwh = 0.024;
const charcoalCarbonEmitedCo2PerKg = 9.7;
const buthenCarbonEmitedCo2Perkg = 3.01;
const woodCarbonEmitedCo2PerKg = 2.1;

const householdCarbonFootPrintCalculator = (data) => {
  const householdEnergy = data;
  console.log(householdEnergy.heatingAndCooling, "gg");
  const heatingAndCooling = householdEnergy.heatingAndCooling;
  let heatingAndCoolingCarbonFootPrint = 0;
  heatingAndCooling.forEach((item) => {
    if (item.type === "electric") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 1.5 * year;
    } else if (item.type === "charcoal") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * charcoalCarbonEmitedCo2PerKg * 0.58 * year;
    } else if (item.type === "butane") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * buthenCarbonEmitedCo2Perkg * 0.189 * year;
    } else if (item.type === "wood") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * woodCarbonEmitedCo2PerKg * 0.58 * year;
    }
  });
  // for cooking
  const cooking = householdEnergy.cooking;
  let cookingCarbonFootPrint = 0;
  cooking.forEach((item) => {
    if (item.type === "electric") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 1.5 * year;
    } else if (item.type === "charcoal") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.58 * year;
    } else if (item.type === "gas") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * buthenCarbonEmitedCo2Perkg * 0.189 * year;
    } else if (item.type === "wood") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * woodCarbonEmitedCo2PerKg * 1.3 * year; // Hourly Firewood Consumption Patterns and CO2 Emission Patterns in Rural Households of Nepal
    }
  });

  // for electric appliance
  const electricAppliance = householdEnergy.electricAppliance;
  let electricApplianceCarbonFootPrint = 0;
  electricAppliance.forEach((item) => {
    if (item.type === "tv") {
      electricApplianceCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.1 * year; // 0.1kw is the average wattage of a tv by assuming an avarage of 40 inch lcd tv
    } else if (item.type === "washingMachine") {
      electricApplianceCarbonFootPrint +=
        item.hourlyUsagePerDay *
        item.frequencyperWeek *
        0.5 *
        electricCarbonEmitedKgPerKwh *
        week; // 0.5kw is the average wattage of a washing machine
    } else if (item.type === "iron") {
      electricApplianceCarbonFootPrint +=
        item.hourlyUsagePerDay *
        item.frequencyperWeek *
        electricCarbonEmitedKgPerKwh *
        1.1 *
        week; // 1.1kw is the average wattage of an iron
    } else if (item.type === "refrigerator") {
    }
    electricApplianceCarbonFootPrint +=
      24 * electricCarbonEmitedKgPerKwh * 0.15 * year; // 0.15kw is the average wattage of a refrigerator
  });

  // for light bulbs
  const lightBulbs = householdEnergy.lightBulbs;
  let lightBulbsCarbonFootPrint = 0;
  lightBulbs.forEach((item) => {
    if (item.type === "incandescent") {
      lightBulbsCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.04 * year; // 0.04kw is the average wattage of an iron
    } else if (item.type === "cfl") {
      item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.013 * year; // 0.013kw is the average  wattage of a cfl
    } else if (item.type === "led") {
      item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.007 * year; // 0.007kw is the average wattage of a led
    } else if (item.type === "fluorescent") {
      item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.036 * year; //  0.036kw is the average wattage of a fluorescent
    }
  });

  return (
    heatingAndCoolingCarbonFootPrint +
    cookingCarbonFootPrint +
    electricApplianceCarbonFootPrint +
    lightBulbsCarbonFootPrint
  );
};

// transportation mode carbon footprint calculator

const transportationModeCarbonFootPrintCalculator = (data) => {
  //for own automobile
  const ownAutomobile = data.ownAutomobile;
  let ownAutomobileCarbonFootPrint = 0;
  ownAutomobile.forEach((item) => {
    if (item.type === "gasPowered") {
      ownAutomobileCarbonFootPrint +=
        item.distance * item.frequencyperWeek * 0.15 * week; //0.15kg is the average co2 emission of a gas powered car per km
    } else if (item.type === "electricPowered") {
      ownAutomobileCarbonFootPrint +=
        item.distance * item.frequencyperWeek * 0.037 * week; // 0.033kg is the average co2 emission of an electric car per km
    }
  });

  //for public transport
  const publicTransport = data.publicTransport;
  let publicTransportCarbonFootPrint = 0;
  publicTransport.forEach((item) => {
    if (item.type === "bus") {
      publicTransportCarbonFootPrint +=
        ((item.distance * item.frequencyperWeek * 1.1) / 100) * week; // 0.01kg is the average co2 emission of a bus per km over 100 passengers
    } else if (item.type === "taxi") {
      publicTransportCarbonFootPrint +=
        ((item.distance * item.frequencyperWeek * 0.159) / 14) * week; // 0.0114kg is the average co2 emission of a taxi per km over 14 passengers
    } else if (item.type === "train") {
      publicTransportCarbonFootPrint +=
        item.distance *
        item.frequencyperWeek *
        electricCarbonEmitedKgPerKwh *
        0.57 *
        week; // 0.57kwh is the average usage of a train per km
    } else if (item.type === "ride") {
      publicTransportCarbonFootPrint +=
        item.distance * item.frequencyperWeek * 0.15 * week; // 0.15kg is the average co2 emission of a ride per km
    }
  });

  //for bicycle
  const bicycle = data.bicycle;
  let bicycleCarbonFootPrint = 0;
  bicycle.forEach((item) => {
    bicycleCarbonFootPrint +=
      item.distance * item.frequencyperWeek * 0.021 * week; // 0.021kg is the average co2 emission of a bicycle per km
  });
  //for walking
  const walking = data.walking;
  let walkingCarbonFootPrint = 0;
  walking.forEach((item) => {
    walkingCarbonFootPrint +=
      item.distance * item.frequencyperWeek * 0.036 * week; // 0.036kg is the average co2 emission of a walking per km
  });

  return (
    ownAutomobileCarbonFootPrint +
    publicTransportCarbonFootPrint +
    bicycleCarbonFootPrint +
    walkingCarbonFootPrint
  );
};

// diet and food carbon footprint calculator

const dietAndFoodCarbonFootPrintCalculator = (data) => {
  // for poultry
  const poultry = data.poultry;
  let poultryCarbonFootPrint = 0;
  poultryCarbonFootPrint += ((poultry?.weeklyUsage * 0.39) / year) * 6.9 * week; // 6.9kg is the average co2 emission with one kg meal of poultry and 0.39kg is the average meal a person eats per year

  // for vegetable
  const vegetable = data.vegetable;
  let vegetableCarbonFootPrint = 0;
  vegetableCarbonFootPrint +=
    ((vegetable?.weeklyUsage * 12.2) / year) * 2 * week; //2kg is the average co2 emission with one kg meal of vegetable and 12.2kg is the average meal a person eats per year

  // for meat
  const meat = data.meat;
  let meatCarbonFootPrint = 0;
  meatCarbonFootPrint += ((meat?.weeklyUsage * 0.52) / year) * 27 * week; // 27kg is the average co2 emission with one kg meal of meat and 0.52kg is the average meal a person eats per year

  // for fish
  const fish = data.fish;
  let fishCarbonFootPrint = 0;
  fishCarbonFootPrint += ((fish?.weeklyUsage * 12) / year) * 27 * week; // 27kg is the average co2 emission with one kg meal of fish and 12kg is the average meal a person eats per year

  return (
    poultryCarbonFootPrint +
    vegetableCarbonFootPrint +
    meatCarbonFootPrint +
    fishCarbonFootPrint
  );
};

// weste disposal carbon footprint calculator. This Calculator is based on addis ababa city waset disposal data

const wasteDisposalCarbonFootPrintCalculator = (data) => {
  // for weekly collection

  const frequency = data.weeklyCollection.frequency;
  let weeklyCollectionCarbonFootPrint = 0;
  weeklyCollectionCarbonFootPrint = frequency * 0.685 * year; // in addis ababa the avarage co2 emisssion form waste desposal is 836120 Ton c02 per year,so the average co2 emmission per a person is 0.685 kg per day by using 3,353,000 people in addis ababa.
  return weeklyCollectionCarbonFootPrint; //https://epa.gov.et/images/PDF/Climatechange/2016_Addis_Ababa_GHG_Emssion_Report.pdf
};

// water usage carbon footprint calculator
const waterUsageCarbonFootPrintCalculator = (data) => {
  const washingClothes = data.washingClothes;
  let washingClothesCarbonFootPrint = 0;
  washingClothesCarbonFootPrint +=
    washingClothes.frequencyperWeek * 50 * 0.0082 * year; // 50 liters is the average water usage per washing a clothes for a one time frequency. 0.0082 is the avarage kg co2 emmitted per liter of water usage.

  const showers = data.showers;
  let showersCarbonFootPrint = 0;
  showersCarbonFootPrint +=
    showers.daysPerWeek * showers.averageDuration * 7.5 * 0.0082 * year; // 7.5 liters is the average water usage per shower  in one minute

  const gardenWatering = data.gardenWatering;
  let gardenWateringCarbonFootPrint = 0;
  gardenWateringCarbonFootPrint +=
    gardenWatering.daysPerWeek *
    gardenWatering.averageDuration *
    34 *
    0.0082 *
    year; // 34 liters is the average water usage per garden watering in  one minute

  return (
    washingClothesCarbonFootPrint +
    showersCarbonFootPrint +
    gardenWateringCarbonFootPrint
  );
};

//food westage carbon footprint calculator

const foodWastageCarbonFootPrintCalculator = (data) => {
  const foodWastage = data;
  let foodWastageCarbonFootPrint = 0;
  foodWastageCarbonFootPrint += foodWastage * 2.5 * year; // 2.5kg is the average co2 emission of a food wastage per kg

  return foodWastageCarbonFootPrint;
};

console.log(householdCarbonFootPrintCalculator(data.householdEnergy));
console.log(
  transportationModeCarbonFootPrintCalculator(data.transportationMode)
);
console.log(dietAndFoodCarbonFootPrintCalculator(data.dietAndFood));
console.log(wasteDisposalCarbonFootPrintCalculator(data.wasteDisposal));
console.log(waterUsageCarbonFootPrintCalculator(data.waterUsage));
console.log(foodWastageCarbonFootPrintCalculator(data.foodWastage));

// total carbon footprint calculator
const totalCarbonFootPrintCalculator = (data) => {
  const sum =
    householdCarbonFootPrintCalculator(data.householdEnergy) +
    transportationModeCarbonFootPrintCalculator(data.transportationMode) +
    dietAndFoodCarbonFootPrintCalculator(data.dietAndFood) +
    wasteDisposalCarbonFootPrintCalculator(data.wasteDisposal) +
    waterUsageCarbonFootPrintCalculator(data.waterUsage) +
    foodWastageCarbonFootPrintCalculator(data.foodWastage);
  return {
    totalSum: sum,
    average: sum / 6,
  };
};

module.exports = {
  householdCarbonFootPrintCalculator,
  transportationModeCarbonFootPrintCalculator,
  dietAndFoodCarbonFootPrintCalculator,
  wasteDisposalCarbonFootPrintCalculator,
  waterUsageCarbonFootPrintCalculator,
  foodWastageCarbonFootPrintCalculator,
  totalCarbonFootPrintCalculator,
};
