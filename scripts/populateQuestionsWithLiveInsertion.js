const fs = require("fs");
const readline = require("readline");
const mongoose = require("mongoose");
const Question = require("../models/Question");
const Language = require("../models/Language");
require("dotenv").config({path: "../.env"});

// MongoDB connection logic with retry functionality
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.log("🔄 Retrying in 5 seconds...");
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
};

// MongoDB event handlers for disconnection and error handling
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected! Retrying...");
  connectWithRetry();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// Utility function to read JSON files
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read file ${filePath}:`, error.message);
    return null;
  }
};

// Function to display mock insertion
const displayMockInsertion = async (file1, file2) => {
  const data1 = readJSONFile(file1);
  const data2 = readJSONFile(file2);

  if (!data1 || !data2) {
    console.error("Failed to read one or both files.");
    return null;
  }

  if (data1.length !== data2.length) {
    console.error("The two files do not have the same number of questions.");
    return null;
  }

  console.log("\nFirst JSON Object from File 1:");
  console.log(JSON.stringify(data1[0], null, 2));

  console.log("\nFirst JSON Object from File 2:");
  console.log(JSON.stringify(data2[0], null, 2));

  console.log("\nMock Insertion Preview:");
  for (let i = 0; i < data1.length; i++) {
    const question1 = data1[i];
    const question2 = data2[i];

    console.log(`\nQuestion Pair ${i + 1}:`);
    console.log(`Difficulty: ${question1.difficulty}`);
    console.log(`Language 1 (${question1.translations[0].language}): ${question1.translations[0].question}`);
    console.log(`Language 2 (${question2.translations[0].language}): ${question2.translations[0].question}`);
    console.log("Options:");
    question1.translations[0].options.forEach((option, index) => {
      console.log(`  ${index + 1}. ${option.text} (${option.isCorrect ? "Correct" : "Incorrect"})`);
    });
  }

  return { data1, data2 };
};

// Function to insert questions into the database
const insertQuestions = async (data1, data2) => {
  for (let i = 0; i < data1.length; i++) {
    const question1 = data1[i];
    const question2 = data2[i];

    // Check if the question already exists in the database
    const existingQuestion = await Question.findOne({
      "translations.question": question1.translations[0].question,
    });

    if (existingQuestion) {
      console.log(`Skipping duplicate question: ${question1.translations[0].question}`);
      continue;
    }

    // Validate languages
    const language1 = await Language.findOne({ name: question1.translations[0].language });
    const language2 = await Language.findOne({ name: question2.translations[0].language });

    if (!language1 || !language2) {
      console.error(
        `One or both languages do not exist for question: ${question1.translations[0].question}`
      );
      continue;
    }

    // Increment the number of questions in the languages
    language1.numberOfQuestions += 1;
    language2.numberOfQuestions += 1;
    await language1.save();
    await language2.save();

    // Create the question object
    const newQuestion = new Question({
      translations: [
        {
          language: question1.translations[0].language,
          question: question1.translations[0].question,
          options: question1.translations[0].options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            explanation: option.explanation,
          })),
        },
        {
          language: question2.translations[0].language,
          question: question2.translations[0].question,
          options: question2.translations[0].options.map((option) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            explanation: option.explanation,
          })),
        },
      ],
      difficulty: question1.difficulty || "General", // Default difficulty if not provided
      category: "General", // Default category since it's not in the JSON
    });

    // Save the question to the database
    await newQuestion.save();
    console.log(`Inserted question: ${question1.translations[0].question}`);
  }

  console.log("Finished inserting questions.");
};

// Main function
const main = async () => {
  await connectWithRetry();

  const file1 = "./data/questions_en.json"; // Path to the first JSON file
  const file2 = "./data/questions_am.json"; // Path to the second JSON file

  const { data1, data2 } = await displayMockInsertion(file1, file2);

  if (!data1 || !data2) {
    console.error("Mock insertion failed. Exiting...");
    mongoose.connection.close();
    return;
  }

  // Ask for user confirmation
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\nDo you want to proceed with the actual insertion? (yes/no): ", async (answer) => {
    if (answer.toLowerCase() === "yes") {
      console.log("\nProceeding with actual insertion...");
      await insertQuestions(data1, data2);
    } else {
      console.log("\nInsertion canceled.");
    }

    rl.close();
    mongoose.connection.close();
  });
};

main();