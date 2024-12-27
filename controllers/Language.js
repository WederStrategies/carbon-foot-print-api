const Language = require("../models/Language");

// Create a new language
const createLanguage = async (req, res) => {
  try {
    const { name } = req.body;

    const existingLanguage = await Language.findOne({ name });
    if (existingLanguage) {
      return res.status(400).json({
        message: `Language with name ${name} already exists`,
      });
    }

    const language = new Language({ name });
    const savedLanguage = await language.save();
    res.status(201).json({
      message: "Language created successfully",
      data: savedLanguage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create language",
      error: error.message,
    });
  }
};

// Get all languages
const getAllLanguages = async (req, res) => {
  try {
    const languages = await Language.find();
    res.status(200).json(languages);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch languages",
      error: error.message,
    });
  }
};

// Get a language by ID
const getLanguageById = async (req, res) => {
  try {
    const { id } = req.params;
    const language = await Language.findById(id);

    if (!language) {
      return res.status(404).json({ message: "Language not found" });
    }

    res.status(200).json(language);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch language",
      error: error.message,
    });
  }
};

// Update a language by ID
const updateLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLanguage = await Language.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLanguage) {
      return res.status(404).json({ message: "Language not found" });
    }

    res.status(200).json({
      message: "Language updated successfully",
      data: updatedLanguage,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update language",
      error: error.message,
    });
  }
};

// Delete a language by ID
const deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLanguage = await Language.findByIdAndDelete(id);

    if (!deletedLanguage) {
      return res.status(404).json({ message: "Language not found" });
    }

    res.status(200).json({ message: "Language deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete language",
      error: error.message,
    });
  }
};

module.exports = {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage,
};
