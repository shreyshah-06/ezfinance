const express = require("express");
const router = express.Router();
const {getSalesByUserId} = require('../controllers/sale')

router.route('/sales/getall').post(getSalesByUserId)

module.exports = router