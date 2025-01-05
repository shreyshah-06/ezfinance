const express = require("express");
const router = express.Router();
const {addSupplier,getAllSuppliersByUserId,deleteSupplier} = require('../controllers/supplier')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/supplier/add').post(authMiddleware, addSupplier)
router.route('/supplier/getall').get(authMiddleware, getAllSuppliersByUserId)
router.route('/supplier/delete/:id').delete(authMiddleware, deleteSupplier)

module.exports = router