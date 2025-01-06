const express = require("express");
const router = express.Router();
const {getSummary, getInventorySummary, getSixMonthTrends, getRecentInvoices} = require('../controllers/dashboard')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/summary').get(authMiddleware, getSummary)
router.route('/inventory/summary').get(authMiddleware, getInventorySummary)
router.route('/six-month-trends').get(authMiddleware, getSixMonthTrends)
router.route('/invoice/recent').get(authMiddleware, getRecentInvoices)

module.exports = router