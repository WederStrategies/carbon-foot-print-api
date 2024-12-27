const QuestionCategory = require("../models/QuestionCategory");

// Create a new question category
const createQuestionCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }
    const existingCategory = await QuestionCategory.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        message: `Category with name ${name} already exists`,
      });
    }

    const category = new QuestionCategory({ name });
    const savedCategory = await category.save();
    res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// Get all question categories
const getAllQuestionCategories = async (req, res) => {
  try {
    const categories = await QuestionCategory.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// Get a question category by ID
const getQuestionCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await QuestionCategory.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// Update a question category by ID
const updateQuestionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCategory = await QuestionCategory.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// Delete a question category by ID
const deleteQuestionCategory = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedCategory = await QuestionCategory.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  createQuestionCategory,
  getAllQuestionCategories,
  getQuestionCategoryById,
  updateQuestionCategory,
  deleteQuestionCategory,
};
