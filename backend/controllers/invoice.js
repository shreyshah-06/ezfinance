const Invoice = require("../models/invoice");
const Sale = require("../models/sale");
const Product = require('../models/product')
const Tax = require('../models/tax')
const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
const addInvoice = async (req, res) => {
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
    const {customerName, date, products } = req.body;
    const lastInvoice = await Invoice.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]], // Get the latest invoice
      attributes: ["invoiceNumber"], // Select only the invoice number
    });

    let newInvoiceNumber = 1;
    if (lastInvoice) {
      newInvoiceNumber = lastInvoice.invoiceNumber + 1;
    }

    let totalAmount = 0;
    let totalTax = 0;
    let totalPurchaseAmount = 0; 
    for (const product of products) {
      const availableProduct = await Product.findOne({
        where: { userId, id: product.productId },
        attributes: ["quantity"],
      });
      if (!availableProduct || availableProduct.quantity < product.quantity) {
        return res.status(400).json({ error: "Insufficient product quantity" });
      }

      // Reduce the quantity from the products table
      await Product.update(
        { quantity: sequelize.literal(`quantity - ${product.quantity}`) },
        { where: { userId, id: product.productId } }
      );
      let cost = product.quantity * availableProduct.purchasePrice; // Calculate purchase cost
      totalPurchaseAmount += cost; // Add purchase cost to total
      let sellingPrice = product.quantity * product.price * (1 - product.discountPercentage / 100);
      totalAmount += sellingPrice;
      totalTax += (product.taxPercentage / 100) * sellingPrice;
    };
    const profit = totalAmount-totalPurchaseAmount;
    totalAmount+=totalTax

    // Create a new invoice entry
    const newInvoice = await Invoice.create({
      userId,
      invoiceNumber: newInvoiceNumber,
      customerName,
      date,
      totalAmount,
      totalTax,
      profit
    });
    // Add sales data for each product
    for (const product of products) {
      await Sale.create({
        userId,
        invoiceNumber: newInvoice.invoiceNumber,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
        discountPercentage: product.discountPercentage,
        total:
          product.quantity *
          product.price *
          (1 - product.discountPercentage / 100),
      });
    }

    res.status(201).json({ message: "Invoice added successfully", invoice: newInvoice });
  } catch (error) {
    console.error("Error adding invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInvoicesByUserId = async (req, res) => {
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
      let sortOption;
    const { sortBy, sortOrder } = req.query;
    if (sortBy && sortOrder) {
      sortOption = [[sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']];
    }
    const invoices = await Invoice.findAll({ where: { userId },order: sortOption });
    const totalInvoiceAmt = await Invoice.aggregate('totalAmount', 'SUM', {where: { userId }});
    res.status(200).json({ invoices,totalInvoiceAmt});
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteInvoice = async (req, res) => {
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
    const {id} = req.body
    console.log(id)
    const deletedInvoice = await Invoice.destroy({
      where: {
        userId,
        id
      }
    });

    // Check if the invoice was deleted
    if (deletedInvoice === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }


    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInvoiceItemsById = async (req, res) => {
  try {
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

    const { invoiceId } = req.params;  // Get the invoice number from URL params

    // Fetch the invoice based on userId and invoiceNumber
    const invoice = await Invoice.findOne({
      where: { userId, invoiceNumber: invoiceId },
      attributes: ['totalAmount', 'totalTax', 'customerName'], // Fetch only required fields
    });
    
    

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    const sales = await Sale.findAll({
      where: { userId, invoiceNumber: invoiceId },
      attributes: ['quantity', 'price', 'discountPercentage', 'total', 'productId'], 
      include: [
        {
          model: Product,
          attributes: ['model', 'taxId'], 
          include: [
            {
              model: Tax,
              attributes: ['rate'],
            },
          ],
        },
      ],
    });
    console.log(sales)

    res.status(200).json({ invoice, sales });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {addInvoice,getInvoicesByUserId,deleteInvoice, getInvoiceItemsById}