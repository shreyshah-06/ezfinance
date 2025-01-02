const Expense = require('../models/expense')
const jwt = require("jsonwebtoken");

const addExpense = async(req,res)=>{
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
        const {vendorName,date,totalAmount,expenseName} = req.body
        const lastExpense = await Expense.findOne({
            where: { userId },
            order: [["createdAt", "DESC"]],
            attributes: ["expenseId"],
        });
        let newExpenseNumber = 1;
        if (lastExpense) {
          newExpenseNumber = lastExpense.expenseId + 1;
        }
        const newExpense = await Expense.create({
            expenseId:newExpenseNumber,
            vendorName,
            date,
            expenseName,
            totalAmount,
            userId,
        })
        res.status(201).json({ message: "Expense added successfully", expense: newExpense });
    } catch (error) {
        console.log("Error adding Expense:", error);
        res.status(500).json({error:"Internal server error"});
    }
}

const getExpensesByUserId = async (req, res) => {
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
        const {sortBy,sortType } = req.query;
    
        let whereCondition = { userId };
    
        let order = [];
        if (sortType === 'asc') {
          order.push([sortBy, 'ASC']);
        } else if (sortType === 'desc') {
          order.push([sortBy, 'DESC']);
        }
    
        const expenses = await Expense.findAll({
          where: whereCondition,
          order
        });

        const totalExpense = await Expense.aggregate('totalAmount', 'SUM', { where: whereCondition });
    
        res.status(200).json({ expenses,totalExpense});
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteExpense = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    let userId;
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      } else {
        userId = decodedToken.id;
        console.log(userId);
      }
    });
    
    const { expenseId } = req.params;
    const expense = await Expense.findOne({
      where: { expenseId, userId }
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }
    await Expense.destroy({
      where: { expenseId, userId }
    });

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting Expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {addExpense,getExpensesByUserId, deleteExpense}