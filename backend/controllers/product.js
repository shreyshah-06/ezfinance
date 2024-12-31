const Product = require("../models/product");
// const Tax = require("../models/tax")
const jwt = require("jsonwebtoken");
const addProduct = async (req, res) => {
    try {
      const {serialNumber, model, categoryId, sellingPrice, taxId, supplierId, purchasePrice ,quantity} = req.body;
      const token = req.headers.authorization.split(" ")[1];  // Get the token from the Authorization header
      let userId;
  
      // Verify JWT token
      jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        } else {
          userId = decodedToken.id;  // Extract the userId from the decoded token
        }
      });
      const newProduct = await Product.create({
        userId,
        serialNumber,
        model,
        categoryId,
        sellingPrice,
        taxId,
        supplierId,
        purchasePrice,
        quantity
      });
  
      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};

const getProductsByUserId = async (req, res) => {
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
      const products = await Product.findAll({ where: { userId } });
      res.status(200).json({ products });
  } catch (error) {
      console.error('Error fetching products by userId:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports={addProduct,getProductsByUserId}

