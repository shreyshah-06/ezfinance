const Tax = require("../models/tax");
const sequelize = require("../config/database");

const addTax = async (req, res) => {
  // Start a new transaction to ensure atomicity of the tax creation operation
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name, rate } = req.body;

    // Input validation: Ensure that name and rate are provided and valid
    if (!name || typeof name !== 'string' || name.trim() === '') {
      // Rollback the transaction if validation fails
      await transaction.rollback();
      return res.status(400).json({ error: "Tax name is required." });
    }

    if (isNaN(rate) || rate <= 0) {
      // Rollback the transaction if rate is invalid
      await transaction.rollback();
      return res.status(400).json({ error: "Valid tax rate is required." });
    }

    // Create a new tax slab in the database within the transaction context
    const newTax = await Tax.create({
      userId,
      name,
      rate,
    }, { transaction });

    // Commit the transaction to finalize the creation of the tax slab
    await transaction.commit();

    // Respond with the newly created tax slab and a success message
    res.status(201).json({ message: "Tax added successfully", tax: newTax });
  } catch (error) {
    // Rollback the transaction in case of an error during tax creation
    await transaction.rollback();
    console.error("Error adding tax:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTaxesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tax slabs associated with the user from the database
    const taxSlabs = await Tax.findAll({ where: { userId } });

    // Respond with the list of tax slabs
    res.status(200).json({ taxSlabs });
  } catch (error) {
    console.error("Error fetching Tax Slabs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTaxSlab = async (req, res) => {
  // Start a new transaction to ensure atomicity of the tax deletion operation
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params; // Extract tax slab ID from URL parameters

    // Validate that the tax slab ID is valid
    if (!id || isNaN(id)) {
      // Rollback the transaction if the ID is invalid
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid tax slab ID" });
    }

    // Check if the tax slab exists before attempting deletion
    const taxSlab = await Tax.findOne({ where: { id }, transaction });

    if (!taxSlab) {
      // Rollback the transaction if the tax slab does not exist
      await transaction.rollback();
      return res.status(404).json({ error: "Tax Slab not found" });
    }

    // Delete the tax slab from the database within the transaction context
    const deletedTaxSlab = await Tax.destroy({
      where: { id },
      transaction,
    });

    if (deletedTaxSlab === 0) {
      // Rollback the transaction if the deletion fails
      await transaction.rollback();
      return res.status(404).json({ error: "Tax Slab not found" });
    }

    // Commit the transaction to finalize the deletion
    await transaction.commit();

    // Respond with a success message
    res.status(200).json({ message: "Tax Slab deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of any error during deletion
    await transaction.rollback();
    console.error("Error deleting Tax Slab:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addTax, getAllTaxesByUserId, deleteTaxSlab };
