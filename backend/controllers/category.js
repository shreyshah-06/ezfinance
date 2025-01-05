const Category = require("../models/category");

const addCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    // Input validation for fields
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({ error: "Category name is required." });
    }

    const newCategory = await Category.create({
      userId,
      name,
    });

    res.status(201).json({ message: "Category added successfully", category: newCategory });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllCategoriesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await Category.findAll({ where: { userId } });

    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate id is a number or a valid type if needed
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const deletedCategory = await Category.destroy({
      where: { id },
    });

    if (deletedCategory === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addCategory, getAllCategoriesByUserId, deleteCategory };
