const express = require("express");
const router = express.Router();
const {addCustomer} = require('../controllers/customer')

router.route('/customer/add').post(addCustomer)

module.exports = router