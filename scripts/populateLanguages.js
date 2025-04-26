const mongoose = require("mongoose");
const Language = require("../models/Language");
require("dotenv").config({path: "../.env"}); // Load environment variables from .env

// MongoDB connection
const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

// Function to populate languages
const populateLanguages = async () => {
  const languages = [
    { name: "English", numberOfQuestions: 0 },
    { name: "Amharic", numberOfQuestions: 0 },
    // Add more languages as needed
  ];

  try {
    for (const language of languages) {
      const existingLanguage = await Language.findOne({ name: language.name });
      if (!existingLanguage) {
        await Language.create(language);
        console.log(`Added language: ${language.name}`);
      } else {
        console.log(`Language already exists: ${language.name}`);
      }
    }
    console.log("Finished populating languages.");
  } catch (error) {
    console.error("❌ Error populating languages:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await populateLanguages();
  mongoose.connection.close();
};

main();