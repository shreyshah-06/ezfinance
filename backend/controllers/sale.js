const Sale = require('../models/sale'); // Import the Sale model
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");

const getSalesByUserId = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    let userId;
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        userId = decodedToken.id; // Access 'id' instead of 'userId'
        console.log(userId); // You can log the userId if needed
      }
    });
    const { productId, sortBy,sortType, fromDate, toDate } = req.query;
    let whereCondition = { userId };
    if (productId) {
      whereCondition.productId = productId;
    }

    if (fromDate && toDate) {
      whereCondition.createdAt = {
          [Op.between]: [fromDate, toDate]
      };
  } else if (fromDate) {
    whereCondition.createdAt = {
          [Op.gte]: fromDate
      };
  } else if (toDate) {
    whereCondition.createdAt = {
          [Op.lte]: toDate
      };
  }

    let order = [];
    if (sortType === 'asc') {
      order.push([sortBy, 'ASC']);
    } else if (sortType === 'desc') {
      order.push([sortBy, 'DESC']);
    }

    const sales = await Sale.findAll({
      where: whereCondition,
      order
    });

    const totalSales = await Sale.aggregate('total', 'SUM', { where: whereCondition });
    res.status(200).json({ sales,totalSales });
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getSalesByUserId };
