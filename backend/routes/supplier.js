const express = require("express");
const router = express.Router();
const {addSupplier,getAllSuppliersByUserId,deleteSupplier} = require('../controllers/supplier')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/add').post(authMiddleware, addSupplier)
router.route('/getall').get(authMiddleware, getAllSuppliersByUserId)
router.route('/delete/:id').delete(authMiddleware, deleteSupplier)

module.exports = router