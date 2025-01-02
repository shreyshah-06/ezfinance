const express = require("express");
const router = express.Router();
const {addExpense,getExpensesByUserId, deleteExpense} = require('../controllers/expense')

router.route('/expense/add').post(addExpense)
router.route('/expense/getall').post(getExpensesByUserId)
router.route('/expense/delete/:expenseId').delete(deleteExpense)
module.exports = router