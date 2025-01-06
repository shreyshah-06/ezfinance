const express = require("express");
const router = express.Router();
const {getAuditDataByUserId} = require('../controllers/audit')
const {authMiddleware} = require('../middleware/authValidators')

router.route('/getall').get(authMiddleware, getAuditDataByUserId)
module.exports = router