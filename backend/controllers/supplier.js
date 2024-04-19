const Supplier = require("../models/supplier");
const jwt = require("jsonwebtoken");
const addSupplier = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
      console.log(token);
      let userId;
      jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          userId = decodedToken.id; 
          console.log(userId); 
        }
      });
    const {name, contact, address, details, previousCreditBalance } = req.body;

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
    const token = req.headers.authorization.split(' ')[1];
    let userId;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        userId = decodedToken.id;
        console.log(userId);
        const suppliers = await Supplier.findAll({ where: { userId } });
        res.status(200).json({ suppliers });
      }
    });
  } catch (error) {
    console.error("Error fetching Suppliers:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSupplier = async (req, res) => {
  try {
        const { id } = req.body;
        const deletedSupplier= await Supplier.destroy({
          where: {
            id
          }
        });
        if (deletedSupplier === 0) {
          return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("Error deleting Supplier:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {addSupplier,getAllSuppliersByUserId,deleteSupplier}