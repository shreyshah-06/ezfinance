const Sale = require('../models/sale'); // Import the Sale model
const { Op } = require('sequelize');

const getSalesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, sortBy, sortType, fromDate, toDate } = req.query;
    
    let whereCondition = { userId };

    if (productId) {
      whereCondition.productId = productId;
    }

    // Handle date range filters
    if (fromDate || toDate) {
      whereCondition.createdAt = {};
      
      if (fromDate) {
        whereCondition.createdAt[Op.gte] = fromDate;
      }

      if (toDate) {
        whereCondition.createdAt[Op.lte] = toDate;
      }
    }

    // Determine the sorting order
    const order = sortBy && sortType ? [[sortBy, sortType.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']] : [];

    // Query for sales data
    const sales = await Sale.findAll({
      where: whereCondition,
      order
    });

    // Calculate total sales using SUM aggregation
    const totalSales = await Sale.sum('total', { where: whereCondition });

    res.status(200).json({ sales, totalSales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getSalesByUserId };
