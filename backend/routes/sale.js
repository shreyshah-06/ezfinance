const express = require("express");
const router = express.Router();
const {getSalesByUserId} = require('../controllers/sale')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/sales/getall').get(authMiddleware, getSalesByUserId)

module.exports = router