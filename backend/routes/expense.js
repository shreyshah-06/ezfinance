const express = require("express");
const router = express.Router();
const {addExpense,getExpensesByUserId, deleteExpense} = require('../controllers/expense')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/expense/add').post(authMiddleware, addExpense)
router.route('/expense/getall').get(authMiddleware, getExpensesByUserId)
router.route('/expense/delete/:expenseId').delete(authMiddleware, deleteExpense)
module.exports = router