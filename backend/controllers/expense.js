const Expense = require("../models/expense");

const addExpense = async (req, res) => {
  const t = await Expense.sequelize.transaction();  // Start a transaction
  try {
    const userId = req.user.id;
    const { vendorName, date, totalAmount, expenseName } = req.body;

    // Input validation
    if (!vendorName || !expenseName || !totalAmount || !date) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Handling expenseId generation
    const lastExpense = await Expense.findOne({
      where: { userId },
      order: [["createdAt", "DESC"]],
      attributes: ["expenseId"],
      transaction: t,
    });

    let newExpenseNumber = 1;
    if (lastExpense) {
      newExpenseNumber = lastExpense.expenseId + 1;
    }

    // Create new expense 
    const newExpense = await Expense.create(
      {
        expenseId: newExpenseNumber,
        vendorName,
        date,
        expenseName,
        totalAmount,
        userId,
      },
      { transaction: t }
    );

    // Commit the transaction if everything is successful
    await t.commit();

    res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    // If any error occurs, rollback the transaction
    await t.rollback();
    console.error("Error adding Expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getExpensesByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sortBy = "createdAt", sortType = "asc" } = req.query;

    // Validate sort parameters
    if (!["asc", "desc"].includes(sortType)) {
      return res.status(400).json({ error: "Invalid sort type." });
    }

    const whereCondition = { userId };

    const order = [[sortBy, sortType]];

    // Fetch expenses for the user
    const expenses = await Expense.findAll({
      where: whereCondition,
      order,
    });

    // Calculate total expense
    const totalExpense = await Expense.aggregate("totalAmount", "SUM", {
      where: whereCondition,
    });

    res.status(200).json({ expenses, totalExpense });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteExpense = async (req, res) => {
  const t = await Expense.sequelize.transaction();  // Start a transaction
  try {
    const userId = req.user.id;
    const { expenseId } = req.params;

    // Validate expenseId
    if (!expenseId || isNaN(expenseId)) {
      return res.status(400).json({ error: "Invalid expense ID" });
    }

    // Check if the expense exists
    const expense = await Expense.findOne({
      where: { expenseId, userId },
      transaction: t,
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    // Delete the expense
    await Expense.destroy({
      where: { expenseId, userId },
      transaction: t,  // Pass the transaction
    });

    // Commit the transaction if everything is successful
    await t.commit();

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    // If any error occurs, rollback the transaction
    await t.rollback();
    console.error("Error deleting Expense:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addExpense, getExpensesByUserId, deleteExpense };
