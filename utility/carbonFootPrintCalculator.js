const data = {
  name: "Kebede",
  housingType: "Apartment",
  householdEnergy: {
    heatingAndCooling: [
      {
        type: "Electric",
        hourlyUsagePerDay: 6,
      },
      {
        type: "charcoal",
        hourlyUsagePerDay: 2,
      },
    ],
    cooking: [
      {
        type: "Electric",
        hourlyUsagePerDay: 3,
      },
    ],
    electricAppliance: [
      {
        type: "Tv",
        hourlyUsagePerDay: 4,
      },
      {
        type: "Washing Machine",
        hourlyUsagePerDay: 1.5,
        frequencyperWeek: 2,
      },
    ],
    lightBulbs: [
      {
        type: "Incandescent",
        hourlyUsagePerDay: 5,
      },
      {
        type: "CFL",
        hourlyUsagePerDay: 2,
      },
    ],
  },
  transportationMode: {
    ownAutomobile: [
      {
        type: "gas powered",
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
      dailyUsage: 0.2,
    },
    vegetable: {
      dailyUsage: 0.5,
    },
    meat: {
      dailyUsage: 0.3,
    },
    fish: {
      dailyUsage: 0.1,
    },
  },
  foodWastage: 15,
  wasteDisposal: {
    weeklyCollection: {
      frequency: 2,
    },
    recycleHabit: "Yes",
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

const carbonFootPrintCalculator = (data) => {
  return data;
};

console.log(carbonFootPrintCalculator(data));
