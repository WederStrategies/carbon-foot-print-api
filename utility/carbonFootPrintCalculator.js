const year = 365;
const week = 52;
const electricCarbonEmitedKgPerKwh = 0.024;
const charcoalCarbonEmitedCo2PerKg = 9.7;
const buthenCarbonEmitedCo2Perkg = 3.01;
const woodCarbonEmitedCo2PerKg = 2.1;

const householdCarbonFootPrintCalculator = (data) => {
  const householdEnergy = data;
  const heatingAndCooling = householdEnergy.heatingAndCooling;
  let heatingAndCoolingCarbonFootPrint = 0;

  // for heating and cooling
  heatingAndCooling.forEach((item) => {
    if (item.type === "electric") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 1.5 * year; // 1.5 kw is an average heater capacity
    } else if (item.type === "charcoal") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * charcoalCarbonEmitedCo2PerKg * 0.58 * year; // 0.58 kg charcoal is used per hour on average
    } else if (item.type === "buthen") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * buthenCarbonEmitedCo2Perkg * 0.189 * year; // 0.189 kg lpg is used per hour on average
    } else if (item.type === "wood") {
      heatingAndCoolingCarbonFootPrint +=
        item.hourlyUsagePerDay * woodCarbonEmitedCo2PerKg * 1.3 * year; // // Hourly Firewood Consumption Patterns and CO2 Emission Patterns in Rural Households of Nepal
    }
  });

  // for cooking
  const cooking = householdEnergy.cooking;
  let cookingCarbonFootPrint = 0;
  cooking.forEach((item) => {
    if (item.type === "electric") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 1.5 * year; // 1.5 kw is an average heater capacity
    } else if (item.type === "charcoal") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * electricCarbonEmitedKgPerKwh * 0.58 * year; // 0.58 kg charcoal is used per hour on average
    } else if (item.type === "gas") {
      cookingCarbonFootPrint +=
        item.hourlyUsagePerDay * buthenCarbonEmitedCo2Perkg * 0.189 * year; // 0.189 kg lpg is used per hour on average
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
      frequencyperWeek = item.frequencyperWeek ? item.frequencyperWeek : 3;
      electricApplianceCarbonFootPrint +=
        item.hourlyUsagePerDay *
        frequencyperWeek *
        0.5 *
        electricCarbonEmitedKgPerKwh *
        week; // 0.5kw is the average wattage of a washing machine
    } else if (item.type === "iron") {
      frequencyperWeek = item.frequencyperWeek ? item.frequencyperWeek : 3;
      electricApplianceCarbonFootPrint +=
        item.hourlyUsagePerDay *
        frequencyperWeek *
        electricCarbonEmitedKgPerKwh *
        1.1 *
        week; // 1.1kw is the average wattage of an iron
    } else if (item.type === "refrigerator") {
      electricApplianceCarbonFootPrint +=
        24 * electricCarbonEmitedKgPerKwh * 0.15 * year;
    }
    // 0.15kw is the average wattage of a refrigerator
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
    } else if (item.type === "hybrid") {
      ownAutomobileCarbonFootPrint +=
        item.distance * item.frequencyperWeek * 0.08 * week; // 0.08kg is the average co2 emission of an electric car per km
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

// waste disposal carbon footprint calculator. This Calculator is based on addis ababa city waset disposal data
const wasteDisposalCarbonFootPrintCalculator = (data) => {
  const frequency = data.weeklyCollection.frequency;
  let weeklyCollectionCarbonFootPrint = 0;
  weeklyCollectionCarbonFootPrint = frequency * 0.685 * week; // in addis ababa the avarage co2 emisssion form waste desposal is 836120 Ton c02 per year,so the average co2 emmission per a person is 0.685 kg per day by using 3,353,000 people in addis ababa.
  return weeklyCollectionCarbonFootPrint; //https://epa.gov.et/images/PDF/Climatechange/2016_Addis_Ababa_GHG_Emssion_Report.pdf
};

// water usage carbon footprint calculator
const waterUsageCarbonFootPrintCalculator = (data) => {
  const washingClothes = data.washingClothes;
  let washingClothesCarbonFootPrint = 0;
  washingClothesCarbonFootPrint +=
    washingClothes.frequencyperWeek * 50 * 0.0082 * week; // 50 liters is the average water usage per washing a clothes for a one time frequency. 0.0082 is the avarage kg co2 emmitted per liter of water usage.

  const showers = data.showers;
  let showersCarbonFootPrint = 0;
  showersCarbonFootPrint +=
    showers.daysPerWeek * showers.averageDuration * 7.5 * 0.0082 * week; // 7.5 liters is the average water usage per shower  in one minute. 0.0082 is the avarage kg co2 emmitted per liter of water usage.

  const gardenWatering = data.gardenWatering;
  let gardenWateringCarbonFootPrint = 0;
  gardenWateringCarbonFootPrint +=
    gardenWatering.daysPerWeek *
    gardenWatering.averageDuration *
    34 *
    0.0082 *
    week; // 34 liters is the average water usage per garden watering in  one minute. 0.0082 is the avarage kg co2 emmitted per liter of water usage.

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
  foodWastageCarbonFootPrint += foodWastage * 2.5 * week; // 2.5kg is the average co2 emission of a food wastage per kg
  return foodWastageCarbonFootPrint;
};

// total carbon footprint calculator
const totalCarbonFootPrintCalculator = (data) => {
  const categories = [
    {
      value: data.householdEnergy,
      calculator: householdCarbonFootPrintCalculator,
    },
    {
      value: data.transportationMode,
      calculator: transportationModeCarbonFootPrintCalculator,
    },
    {
      value: data.dietAndFood,
      calculator: dietAndFoodCarbonFootPrintCalculator,
    },
    {
      value: data.wasteDisposal,
      calculator: wasteDisposalCarbonFootPrintCalculator,
    },
    { value: data.waterUsage, calculator: waterUsageCarbonFootPrintCalculator },
    {
      value: data.foodWastage,
      calculator: foodWastageCarbonFootPrintCalculator,
    },
  ];

  let sum = 0;
  let count = 0;

  categories.forEach((category) => {
    if (category.value !== null && category.value !== undefined) {
      sum += category.calculator(category.value);
      count++;
    }
  });

  return {
    totalSum: sum,
    average: count > 0 ? sum / count : 0, // Avoid dividing by zero
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
