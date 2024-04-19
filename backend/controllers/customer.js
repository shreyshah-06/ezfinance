const Customer = require("../models/customer");

const addCustomer = async (req, res) => {
  try {
    const { userId, name, contact, address, details, previousCreditBalance, email } = req.body;
    const newCustomer = await Customer.create({
      userId,
      name,
      contact,
      address,
      email,
      details,
      previousCreditBalance,
    });
    res.status(201).json({ message: "Customer added successfully", customer: newCustomer });
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {addCustomer}