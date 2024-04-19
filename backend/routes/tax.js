const express = require("express");
const router = express.Router();
const {addTax,getAllTaxesByUserId,deleteTaxSlab} = require('../controllers/tax')

router.route('/tax/add').post(addTax)
router.route('/tax/getall').post(getAllTaxesByUserId)
router.route('/tax/delete').post(deleteTaxSlab)

module.exports = router