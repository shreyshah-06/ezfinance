const Tax = require("../models/tax");
const jwt = require("jsonwebtoken");
const addTax = async (req, res) => {
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
    const {name, rate } = req.body;
    const newTax = await Tax.create({
      userId,
      name,
      rate,
    });

    res.status(201).json({ message: "Tax added successfully", tax: newTax });
  } catch (error) {
    console.error("Error adding tax:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTaxesByUserId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let userId;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        userId = decodedToken.id;
        console.log(userId);
        const taxSlabs = await Tax.findAll({ where: { userId } });
        res.status(200).json({ taxSlabs });
      }
    });
  } catch (error) {
    console.error("Error fetching Tax Slabs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTaxSlab = async (req, res) => {
  try {
        const { id } = req.body;
        const deletedTaxSlab = await Tax.destroy({
          where: {
            id
          }
        });
        if (deletedTaxSlab === 0) {
          return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Tax Slab deleted successfully" });
  } catch (error) {
    console.error("Error deleting Tax Slab:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {addTax,getAllTaxesByUserId,deleteTaxSlab}
