const Question = require("../models/Question");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const question = new Question(req.body);
    if (!question.translations.length) {
      res.status(201).json({ message: "Language not selected" });
    }
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: "Failed to create question", error });
  }
};

// Get all questions
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error });
  }
};

// Get a question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question", error });
  }
};

// Update a question by ID
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { difficulty, category, translations } = req.body;

    if (!difficulty || !category || !translations) {
      return res.status(404).json({ message: " All fields are required" });
    }

    if (!translations.length) {
      return res.status(404).json({ message: "Language not selected " });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: "Failed to update question", error });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question", error });
  }
};

// Add a new translation (language) to an existing question
const addTranslationToQuestion = async (req, res) => {
  const { id } = req.params;
  const { language, question, options } = req.body;

  try {
    const entry = await Question.findById(id);
    if (!entry) {
      return res.status(404).json({ message: "Question not found" });
    }
    const languageExists = entry.translations.some(
      (translation) => translation.language === language
    );

    if (languageExists) {
      return res
        .status(400)
        .json({ message: `Translation for ${language} already exists` });
    }
    const newTranslation = {
      language,
      question,
      options: options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
        explanation: option.explanation,
      })),
    };
    entry.translations.push(newTranslation);

    await entry.save();
    return res
      .status(200)
      .json({ message: "Translation added successfully", entry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Send an equal number of random questions by categories in a different order
const getRandomQuestionsByCategories = async (req, res) => {
  try {
    const { categories } = req.body;
    if (!categories || !categories.length > 0) {
      return res.status(401).json({
        message: "Catagory is required ",
      });
    }
    const numberOfQuestions = 10;
    const questionsPerCategory = Math.floor(
      numberOfQuestions / categories.length
    );
    let questions = [];

    for (const category of categories) {
      const randomQuestions = await Question.aggregate([
        { $match: { category } },
        { $sample: { size: questionsPerCategory } },
      ]);
      questions = questions.concat(randomQuestions);
    }

    // Add extra questions to make up the total number of questions
    const remainingQuestions = numberOfQuestions - questions.length;
    if (remainingQuestions > 0) {
      const extraCategory = categories[0]; // Choose the first category for extra questions
      const extraQuestions = await Question.aggregate([
        { $match: { category: extraCategory } },
        { $sample: { size: remainingQuestions } },
      ]);
      questions = questions.concat(extraQuestions);
    }
    questions = questions.sort(() => Math.random() - 0.5);

    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Method to fetch random questions for Socket.IO
const getRandomQuestions = async () => {
  try {
    const questions = await Question.find();
    return questions;
  } catch (error) {
    console.log(error);
  }
};

// Handle Socket.IO
const handleSocket = (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for client request
  socket.on("fetch-questions", async (data) => {
    const { language, catagoryList } = data;
    try {
      const questions = await getRandomQuestions();

      socket.emit("questions-data", questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      socket.emit("error", "Failed to fetch questions");
    }
  });

  // Listen for client submited answer
  socket.on("submit-answer", async (data) => {
    try {
      const { id, answer } = data;

      const question = await Question.findById(id);
      if (!question) {
        console.log("invalid question id recieved");
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  addTranslationToQuestion,
  handleSocket,
  getRandomQuestionsByCategories,
};
