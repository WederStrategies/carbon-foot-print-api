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
  const { language, questionText, options, explanation } = req.body;

  try {
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    const languageExists = question.translations.some(
      (translation) => translation.language === language
    );

    if (languageExists) {
      return res
        .status(400)
        .json({ message: `Translation for ${language} already exists` });
    }
    const newTranslation = {
      language,
      question: questionText,
      options: options.map((option) => ({
        text: option.text,
        isCorrect: option.isCorrect,
      })),
      explanation,
    };
    question.translations.push(newTranslation);

    await question.save();
    return res
      .status(200)
      .json({ message: "Translation added successfully", question });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  addTranslationToQuestion,
};
