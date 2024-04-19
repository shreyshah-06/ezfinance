const express = require("express");
const router = express.Router();
const {addProduct,getProductsByUserId} = require('../controllers/product')

router.route('/product/add').post(addProduct)
router.route('/product/getAll').post(getProductsByUserId)

module.exports = router