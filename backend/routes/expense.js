const express = require("express");
const router = express.Router();
const {addExpense,getExpensesByUserId, deleteExpense} = require('../controllers/expense')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/add').post(authMiddleware, addExpense)
router.route('/getall').get(authMiddleware, getExpensesByUserId)
router.route('/delete/:expenseId').delete(authMiddleware, deleteExpense)
module.exports = router