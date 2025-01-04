const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const {
      serialNumber,
      model,
      categoryId,
      sellingPrice,
      taxId,
      supplierId,
      purchasePrice,
      quantity,
    } = req.body;
    const userId = req.user.id;
    const newProduct = await Product.create({
      userId,
      serialNumber,
      model,
      categoryId,
      sellingPrice,
      taxId,
      supplierId,
      purchasePrice,
      quantity,
    });

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getProductsByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await Product.findAll({ where: { userId } });
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products by userId:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addProduct, getProductsByUserId };
