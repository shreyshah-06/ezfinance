const Supplier = require("../models/supplier");
const sequelize = require("../config/database");

const addSupplier = async (req, res) => {
  // Start a new transaction to ensure atomicity of the supplier creation operation
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { name, contact, address, details, previousCreditBalance } = req.body;

    // Input validation: Ensure that name, contact, and address are provided
    if (!name || !contact || !address) {
      // Rollback the transaction if validation fails
      await transaction.rollback();
      return res.status(400).json({ error: "Name, contact, and address are required." });
    }

    // Create a new supplier in the database within the transaction context
    const newSupplier = await Supplier.create({
      userId,
      name,
      contact,
      address,
      details,
      previousCreditBalance,
    }, { transaction });

    // Commit the transaction to finalize the creation of the supplier
    await transaction.commit();

    // Respond with the newly created supplier and a success message
    res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
  } catch (error) {
    // Rollback the transaction in case of an error during supplier creation
    await transaction.rollback();
    console.error("Error adding supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllSuppliersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all suppliers associated with the user from the database
    const suppliers = await Supplier.findAll({ where: { userId } });

    // Respond with the list of suppliers
    res.status(200).json({ suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSupplier = async (req, res) => {
  // Start a new transaction to ensure atomicity of the supplier deletion operation
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params; // Extract supplier ID from URL parameters

    // Validate that the supplier ID is valid
    if (!id || isNaN(id)) {
      // Rollback the transaction if the ID is invalid
      await transaction.rollback();
      return res.status(400).json({ error: "Invalid supplier ID" });
    }

    // Check if the supplier exists before attempting deletion
    const supplier = await Supplier.findOne({ where: { id }, transaction });

    if (!supplier) {
      // Rollback the transaction if the supplier does not exist
      await transaction.rollback();
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Delete the supplier from the database within the transaction context
    const deletedSupplier = await Supplier.destroy({
      where: { id },
      transaction,
    });

    if (deletedSupplier === 0) {
      // Rollback the transaction if the deletion fails
      await transaction.rollback();
      return res.status(404).json({ error: "Supplier not found" });
    }

    // Commit the transaction to finalize the deletion
    await transaction.commit();

    // Respond with a success message
    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    // Rollback the transaction in case of any error during deletion
    await transaction.rollback();
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addSupplier, getAllSuppliersByUserId, deleteSupplier };