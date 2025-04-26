const mongoose = require("mongoose");
const Question = require("../models/Question");

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/carbonFootprintDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
};

// Function to list all questions
const listQuestions = async () => {
  try {
    const questions = await Question.find();

    if (questions.length === 0) {
      console.log("No questions found in the database.");
      return;
    }

    console.log("\nList of Questions:");
    questions.forEach((question, index) => {
      console.log(`\nQuestion ${index + 1}:`);
      console.log(`Difficulty: ${question.difficulty}`);
      question.translations.forEach((translation) => {
        console.log(`Language: ${translation.language}`);
        console.log(`Question: ${translation.question}`);
        console.log("Options:");
        translation.options.forEach((option, idx) => {
          console.log(
            `  ${idx + 1}. ${option.text} (${option.isCorrect ? "Correct" : "Incorrect"})`
          );
        });
      });
    });
  } catch (error) {
    console.error("Error retrieving questions:", error.message);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await listQuestions();
  mongoose.connection.close();
};

main();