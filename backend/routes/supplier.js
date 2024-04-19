const express = require("express");
const router = express.Router();
const {addSupplier,getAllSuppliersByUserId,deleteSupplier} = require('../controllers/supplier')

router.route('/supplier/add').post(addSupplier)
router.route('/supplier/getall').post(getAllSuppliersByUserId)
router.route('/supplier/delete').post(deleteSupplier)

module.exports = router