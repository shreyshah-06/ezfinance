const express = require("express");
const router = express.Router();
const {addExpense,getExpensesByUserId} = require('../controllers/expense')

router.route('/expense/add').post(addExpense)
router.route('/expense/getall').post(getExpensesByUserId)
module.exports = router