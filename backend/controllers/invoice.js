const Invoice = require("../models/invoice");
const Sale = require("../models/sale");
const Product = require('../models/product');
const Tax = require('../models/tax');
const sequelize = require("../config/database");

const addInvoice = async (req, res) => {
  // Start a new transaction to ensure atomicity of the operations
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { customerName, date, products } = req.body;

    // Get the most recent invoice number for the user
    const lastInvoice = await Invoice.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: ["invoiceNumber"],
      transaction
    });

    // Initialize the invoice number (start from 1 if no previous invoices exist)
    let newInvoiceNumber = 1;
    if (lastInvoice) {
      newInvoiceNumber = lastInvoice.invoiceNumber + 1;
    }

    // Variables to hold the totals for the invoice
    let totalAmount = 0;
    let totalTax = 0;
    let totalPurchaseAmount = 0;

    // Loop through each product in the invoice to update stock and calculate totals
    for (const product of products) {
      // Check if the product is available in the required quantity
      const availableProduct = await Product.findOne({
        where: { userId, id: product.productId },
        attributes: ["quantity"],
        transaction
      });

      if (!availableProduct || availableProduct.quantity < product.quantity) {
        // Rollback the transaction if there is insufficient product quantity
        await transaction.rollback();
        return res.status(400).json({ error: "Insufficient product quantity" });
      }

      // Update the product stock by reducing the quantity
      await Product.update(
        { quantity: sequelize.literal(`quantity - ${product.quantity}`) },
        { where: { userId, id: product.productId }, transaction }
      );

      // Calculate the cost of the products (purchase cost)
      let cost = product.quantity * availableProduct.purchasePrice;
      totalPurchaseAmount += cost;

      // Calculate the selling price considering any discounts
      let sellingPrice = product.quantity * product.price * (1 - product.discountPercentage / 100);
      totalAmount += sellingPrice;

      // Calculate the tax for the selling price
      totalTax += (product.taxPercentage / 100) * sellingPrice;
    }

    // Calculate the profit from the sale
    const profit = totalAmount - totalPurchaseAmount;
    totalAmount += totalTax; // Add tax to the total amount

    // Create a new invoice entry in the database
    const newInvoice = await Invoice.create({
      userId,
      invoiceNumber: newInvoiceNumber,
      customerName,
      date,
      totalAmount,
      totalTax,
      profit
    }, { transaction });

    // Add sales data for each product in the invoice
    for (const product of products) {
      await Sale.create({
        userId,
        invoiceNumber: newInvoice.invoiceNumber,
        productId: product.productId,
        quantity: product.quantity,
        price: product.price,
        discountPercentage: product.discountPercentage,
        total: product.quantity * product.price * (1 - product.discountPercentage / 100),
      }, { transaction });
    }

    // Commit the transaction if everything is successful
    await transaction.commit();

    // Respond with the success message and the created invoice
    res.status(201).json({ message: "Invoice added successfully", invoice: newInvoice });
  } catch (error) {
    // Rollback the transaction if any error occurs to ensure data integrity
    await transaction.rollback();
    console.error("Error adding invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInvoicesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    let sortOption;
    const { sortBy, sortOrder } = req.query;

    // Determine sorting options if specified by the user
    if (sortBy && sortOrder) {
      sortOption = [[sortBy, sortOrder === 'asc' ? 'ASC' : 'DESC']];
    }

    // Fetch all invoices for the user with optional sorting
    const invoices = await Invoice.findAll({ where: { userId }, order: sortOption });

    // Calculate the total sum of all invoice amounts for the user
    const totalInvoiceAmt = await Invoice.aggregate('totalAmount', 'SUM', { where: { userId } });

    // Respond with the list of invoices and the total amount
    res.status(200).json({ invoices, totalInvoiceAmt });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteInvoice = async (req, res) => {
  // Start a new transaction to ensure the deletion is atomic
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const { invoiceId } = req.params;

    // Find the invoice to be deleted
    const invoice = await Invoice.findOne({ where: { userId, id: invoiceId }, transaction });
    if (!invoice) {
      // Rollback transaction if the invoice doesn't exist
      await transaction.rollback();
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Delete all related sales records for this invoice
    await Sale.destroy({
      where: { userId, invoiceNumber: invoiceId },
      transaction
    });

    // Delete the invoice record
    const deletedInvoice = await Invoice.destroy({
      where: { userId, id: invoiceId },
      transaction
    });

    // Check if the deletion was successful
    if (deletedInvoice === 0) {
      await transaction.rollback(); // Rollback if no invoice was deleted
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Commit the transaction to finalize the deletion
    await transaction.commit();

    // Respond with a success message
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    // Rollback in case of an error to ensure data consistency
    await transaction.rollback();
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getInvoiceItemsById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { invoiceId } = req.params;

    // Fetch the invoice details (totalAmount, totalTax, customerName)
    const invoice = await Invoice.findOne({
      where: { userId, invoiceNumber: invoiceId },
      attributes: ['totalAmount', 'totalTax', 'customerName'],
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    // Fetch the sales records associated with the invoice, including product details
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

    // Respond with the invoice details and associated sales items
    res.status(200).json({ invoice, sales });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addInvoice, getInvoicesByUserId, deleteInvoice, getInvoiceItemsById };
