const express = require("express");
const router = express.Router();
const { addInvoice,getInvoicesByUserId,deleteInvoice } = require("../controllers/invoice");

router.route('/invoice/add').post(addInvoice)
router.route('/invoice/getall').post(getInvoicesByUserId)
router.route('/invoice/delete').post(deleteInvoice)

module.exports = router