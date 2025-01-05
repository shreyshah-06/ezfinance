const Supplier = require("../models/supplier");

const addSupplier = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, contact, address, details, previousCreditBalance } = req.body;

    // Validate required fields
    if (!name || !contact || !address) {
      return res.status(400).json({ error: "Name, contact, and address are required." });
    }

    const newSupplier = await Supplier.create({
      userId,
      name,
      contact,
      address,
      details,
      previousCreditBalance,
    });

    res.status(201).json({ message: "Supplier added successfully", supplier: newSupplier });
  } catch (error) {
    console.error("Error adding supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllSuppliersByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const suppliers = await Supplier.findAll({ where: { userId } });

    res.status(200).json({ suppliers });
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params; // Get supplier ID from params

    const deletedSupplier = await Supplier.destroy({
      where: { id },
    });

    if (deletedSupplier === 0) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addSupplier, getAllSuppliersByUserId, deleteSupplier };
