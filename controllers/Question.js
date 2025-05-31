const Question = require("../models/Question");
const Language = require("../models/Language");
const QuestionCategory = require("../models/QuestionCategory");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { translations } = req.body;

    if (!translations.length) {
      return res.status(404).json({ message: "Language not selected " });
    }

    // Validate languages in translations and increment the number of questions
    for (const translation of translations) {
      const language = await Language.findOne({ name: translation.language });
      if (!language) {
        return res.status(400).json({
          message: `Language with name ${translation.language} does not exist`,
        });
      }
      language.numberOfQuestions += 1;
      await language.save();
    }

    const question = new Question(req.body);
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
    const { difficulty, translations } = req.body;

    if (!difficulty || !translations) {
      return res.status(404).json({ message: " All fields are required" });
    }

    if (!translations.length) {
      return res.status(404).json({ message: "Language not selected " });
    }

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Decrement the number of questions in the old languages if different
    const oldLanguages = question.translations.map((t) => t.language);
    const newLanguages = translations.map((t) => t.language);

    for (const oldLanguage of oldLanguages) {
      if (!newLanguages.includes(oldLanguage)) {
        const languageDoc = await Language.findOne({ name: oldLanguage });
        if (languageDoc) {
          languageDoc.numberOfQuestions -= 1;
          await languageDoc.save();
        }
      }
    }

    // Increment the number of questions in the new languages if different
    for (const newLanguage of newLanguages) {
      if (!oldLanguages.includes(newLanguage)) {
        const languageDoc = await Language.findOne({ name: newLanguage });
        if (!languageDoc) {
          return res.status(400).json({
            message: `Language with name ${newLanguage} does not exist`,
          });
        }
        languageDoc.numberOfQuestions += 1;
        await languageDoc.save();
      }
    }

    const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: "Failed to update question", error });
  }
};

// Delete a question by ID
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Decrement the number of questions in the category
    const category = await QuestionCategory.findOne({
      name: question.category,
    });
    if (category) {
      category.numberOfQuestions -= 1;
      await category.save();
    }

    // Decrement the number of questions in the languages
    for (const translation of question.translations) {
      const language = await Language.findOne({ name: translation.language });
      if (language) {
        language.numberOfQuestions -= 1;
        await language.save();
      }
    }

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question", error });
  }
};

// Delete all questions
const deleteAllQuestions = async (req, res) => {
  try {
    await Question.deleteMany();
    res.status(200).json({ message: "All questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete questions", error });
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

    // Increment the number of questions in the Language schema
    const languageDoc = await Language.findOne({ name: language });
    if (!languageDoc) {
      return res.status(400).json({
        message: `Language with name ${language} does not exist`,
      });
    }
    languageDoc.numberOfQuestions += 1;
    await languageDoc.save();

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

    if (!categories || categories.length === 0) {
      return res.status(401).json({
        message: "Category is required",
      });
    }
    const numberOfQuestions = 10;
    const questionsPerCategory = Math.floor(
      numberOfQuestions / categories.length
    );
    let questions = [];

    for (const category of categories) {
      const randomQuestions = await Question.aggregate([
        { $match: { category, difficulty: "General" } },
        { $sample: { size: Math.ceil(questionsPerCategory / 3) } },
      ]);
      questions = questions.concat(randomQuestions);

      const randomQuestionsMedium = await Question.aggregate([
        { $match: { category, difficulty: "CarbonFootPrint" } },
        { $sample: { size: Math.ceil(questionsPerCategory / 3) } },
      ]);
      questions = questions.concat(randomQuestionsMedium);

      const randomQuestionsHard = await Question.aggregate([
        { $match: { category, difficulty: "Action" } },
        { $sample: { size: Math.floor(questionsPerCategory / 3) } },
      ]);
      questions = questions.concat(randomQuestionsHard);
    }

    // Add extra questions to make up the total number of questions
    const remainingQuestions = numberOfQuestions - questions.length;
    if (remainingQuestions > 0) {
      const extraCategory = categories[0]; // Choose the first category for extra questions
      const extraQuestions = await Question.aggregate([
        { $match: { category: extraCategory, difficulty: "General" } },
        { $sample: { size: remainingQuestions } },
      ]);
      questions = questions.concat(extraQuestions);
    }

    const difficultyOrder = ["General", "CarbonFootPrint", "Action"];
    const sortedData = questions.sort((a, b) => {
      const difficultyA = difficultyOrder.indexOf(a.difficulty);
      const difficultyB = difficultyOrder.indexOf(b.difficulty);
      return difficultyA - difficultyB;
    });

    res.status(200).json(sortedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get 10 random questions: 4 from easy, 4 from medium, and 2 from hard, considering the requested language
const getRandomQuestionsByDifficulty = async (req, res) => {
  const { language } = req.body;

  if (!language) {
    return res.status(400).json({ message: "Language is required" });
  }

  try {
    const difficultyLevels = [
      { level: "Easy", count: 4 },
      { level: "Medium", count: 4 },
      { level: "Difficult", count: 2 },
    ];

    let questions = [];

    for (const { level, count } of difficultyLevels) {
      const randomQuestions = await Question.aggregate([
        { $match: { difficulty: level, "translations.language": language } },
        { $sample: { size: count } },
        {
          $project: {
            difficulty: 1,
            translations: {
              $filter: {
                input: "$translations",
                as: "t",
                cond: { $eq: ["$$t.language", language] },
              },
            },
          },
        },
      ]);

      // Shuffle options for each question
      randomQuestions.forEach((question) => {
        question.translations.forEach((translation) => {
          translation.options = translation.options.sort(() => Math.random() - 0.5);
        });
      });

      questions = [...questions, ...randomQuestions];
    }

    // Log the total number of questions assembled
    console.log(`Total number of questions assembled: ${questions.length}`);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch random questions",
      error: error.message,
    });
  }
};

// Method to fetch random questions for Socket.IO
const getRandomQuestions = async (categories) => {
  const numberOfQuestions = 10;
  const questionsPerCategory = Math.floor(
    numberOfQuestions / categories.length
  );
  let questions = [];

  for (const category of categories) {
    const randomQuestions = await Question.aggregate([
      { $match: { category, difficulty: "easy" } },
      { $sample: { size: Math.ceil(questionsPerCategory / 3) } },
    ]);
    questions = questions.concat(randomQuestions);

    const randomQuestionsMedium = await Question.aggregate([
      { $match: { category, difficulty: "medium" } },
      { $sample: { size: Math.ceil(questionsPerCategory / 3) } },
    ]);
    questions = questions.concat(randomQuestionsMedium);

    const randomQuestionsHard = await Question.aggregate([
      { $match: { category, difficulty: "hard" } },
      { $sample: { size: Math.floor(questionsPerCategory / 3) } },
    ]);
    questions = questions.concat(randomQuestionsHard);
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
  return questions;
};

// Handle Socket.IO
const handleSocket = (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for client request
  socket.on("fetch-questions", async (data) => {
    const { categories } = data;
    try {
      if (!categories || categories.length === 0) {
        return socket.emit("questions-data", "Category list is required");
      }
      const questions = await getRandomQuestions(categories);

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
  deleteAllQuestions,
  getRandomQuestionsByDifficulty, // Add the new function to exports
};
