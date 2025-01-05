const Invoice = require("../models/invoice");
const Expense = require("../models/expense");
const Product = require("../models/product");
const sequelize = require("sequelize");
const { Op } = require("sequelize");

const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // Total Revenue (Sum of all invoices)
    const totalRevenue = await Invoice.sum("totalAmount", {
      where: { userId },
    });

    // Total Expenses (Sum of all expenses)
    const totalExpenses = await Expense.sum("totalAmount", {
      where: { userId },
    });

    // Total Taxes (Sum of all invoice taxes)
    const totalTaxes = await Invoice.sum("totalTax", {
      where: { userId },
    });

    // Profit = Revenue - Expenses - Taxes
    const profit = totalRevenue - totalExpenses - totalTaxes;

    // Respond with summary data
    res.status(200).json({
      totalRevenue: totalRevenue || 0,
      totalExpenses: totalExpenses || 0,
      totalTaxes: totalTaxes || 0,
      profit: profit || 0,
    });
  } catch (error) {
    console.error("Error fetching summary data:", error);
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
};

const getInventorySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Fetch all products for the specific user
    const products = await Product.findAll({
      where: { userId: userId }, // Filter products by userId
    });

    // Calculate total inventory value
    const totalInventoryValue = products.reduce(
      (sum, product) => sum + product.quantity * product.sellingPrice,
      0
    );

    // Get out-of-stock items count
    const outOfStockItems = products.filter(
      (product) => product.quantity === 0
    ).length;

    // Get top 5 items in stock sorted by name
    const topItems = products
      .filter((product) => product.quantity > 0)
      .sort((a, b) => a.model.localeCompare(b.model))
      .slice(0, 5)
      .map((product) => ({
        name: product.model,
        stock: product.quantity,
      }));

    res.status(200).json({
      totalInventoryValue,
      outOfStockItems,
      topItems,
    });
  } catch (error) {
    console.error("Error fetching inventory summary:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getSixMonthTrends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get the current date and the date 6 months ago
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);

    // Date filter for the last 6 months
    const dateFilter = {
      createdAt: {
        [Op.between]: [sixMonthsAgo.toISOString(), today.toISOString()],
      },
    };

    // Fetch sales (invoices) and expenses for the last 6 months
    const [salesTrends, expenseTrends] = await Promise.all([
      Invoice.findAll({
        where: { userId, ...dateFilter },
        attributes: [
          [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'monthGroup'],
          [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalSales'],
        ],
        group: [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM')],
        raw: true,
        order: [[sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']],
      }),
      Expense.findAll({
        where: { userId, ...dateFilter },
        attributes: [
          [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'monthGroup'],
          [sequelize.fn('SUM', sequelize.col('totalAmount')), 'totalExpenses'],
        ],
        group: [sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM')],
        raw: true,
        order: [[sequelize.fn('TO_CHAR', sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']],
      }),
    ]);

    // Prepare trends data
    const trends = {};

    // Aggregate sales data
    salesTrends.forEach(({ totalSales, monthGroup }) => {
      trends[monthGroup] = trends[monthGroup] || { sales: 0, expenses: 0 };
      trends[monthGroup].sales = parseFloat(totalSales);
    });

    // Aggregate expense data
    expenseTrends.forEach(({ totalExpenses, monthGroup }) => {
      trends[monthGroup] = trends[monthGroup] || { sales: 0, expenses: 0 };
      trends[monthGroup].expenses = parseFloat(totalExpenses);
    });

    // Get the last 6 months in order
    const months = [];
    const monthGroups = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'long' });
      const monthGroup = date.toISOString().slice(0, 7); // Format YYYY-MM
      months.push(monthName);
      monthGroups.push(monthGroup);
    }

    // Map trends data into the months array
    const salesData = monthGroups.map((monthGroup) => trends[monthGroup]?.sales || 0);
    const expenseData = monthGroups.map((monthGroup) => trends[monthGroup]?.expenses || 0);

    // Return the response with formatted trends data
    res.status(200).json({
      months,
      salesTrends: salesData,
      expenseTrends: expenseData,
    });
  } catch (error) {
    console.error("Error fetching 6-month trends:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecentInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch the two most recent invoices for the user
    const recentTransactions  = await Invoice.findAll({
      where: { userId },
      attributes: ['id', 'invoiceNumber', 'totalAmount', 'createdAt', 'customerName'],
      order: [['createdAt', 'DESC']], // Order by creation date, most recent first
      limit: 2, // Fetch only the top 2 invoices
    });

    res.status(200).json({ recentTransactions });
  } catch (error) {
    console.error("Error fetching recent invoices:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports = { getSummary, getInventorySummary, getSixMonthTrends, getRecentInvoices};
