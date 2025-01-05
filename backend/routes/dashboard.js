const express = require("express");
const router = express.Router();
const {getSummary, getInventorySummary, getSixMonthTrends, getRecentInvoices} = require('../controllers/dashboard')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/dashboard/summary').get(authMiddleware, getSummary)
router.route('/dashboard/inventory/summary').get(authMiddleware, getInventorySummary)
router.route('/dashboard/six-month-trends').get(authMiddleware, getSixMonthTrends)
router.route('/dashboard/invoice/recent').get(authMiddleware, getRecentInvoices)

module.exports = router