const Category = require("../models/category");
const sequelize = require("../config/database");

const addCategory = async (req, res) => {
  // Start a new transaction to ensure atomicity of the operations
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name } = req.body;

    // Input validation: Check if category name is provided and is a valid string
    if (!name || typeof name !== "string" || name.trim() === "") {
      // Rollback transaction if validation fails
      await transaction.rollback();
      return res.status(400).json({ error: "Category name is required." });
    }

    // Create the new category entry in the database
    const newCategory = await Category.create({
      userId,
      name,
    }, { transaction });

    // Commit the transaction to finalize the creation
    await transaction.commit();

    // Respond with a success message and the created category
    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    // Rollback transaction in case of any error
    await transaction.rollback();
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCategoriesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all categories associated with the user
    const categories = await Category.findAll({ where: { userId } });

    // Respond with the list of categories
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  // Start a new transaction to ensure atomicity of the delete operation
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    // Validate the category ID is a valid number
    if (!id || isNaN(id)) {
      // Rollback transaction if the ID is invalid
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Find the category to be deleted
    const category = await Category.findOne({ where: { id }, transaction });

    if (!category) {
      // Rollback transaction if the category is not found
      await transaction.rollback();
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the category from the database
    const deletedCategory = await Category.destroy({
      where: { id },
      transaction,
    });

    if (deletedCategory === 0) {
      // Rollback if deletion fails
      await transaction.rollback();
      return res.status(404).json({ error: "Category not found" });
    }

    // Commit the transaction to finalize the deletion
    await transaction.commit();

    // Respond with a success message
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    // Rollback transaction in case of an error
    await transaction.rollback();
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addCategory, getAllCategoriesByUserId, deleteCategory };
