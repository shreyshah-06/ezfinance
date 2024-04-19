const express = require("express");
const router = express.Router();
const {getAuditDataByUserId} = require('../controllers/audit')

// router.route('/expense/add').post(addExpense)
router.route('/audit/getall').post(getAuditDataByUserId)
module.exports = router