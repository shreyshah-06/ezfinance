const express = require("express");
const router = express.Router();
const {addCustomer} = require('../controllers/customer')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/customer/add').post(authMiddleware, addCustomer)

module.exports = router