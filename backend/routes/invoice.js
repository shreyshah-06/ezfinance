const express = require("express");
const router = express.Router();
const { addInvoice,getInvoicesByUserId,deleteInvoice, getInvoiceItemsById } = require("../controllers/invoice");

router.route('/invoice/add').post(addInvoice)
router.route('/invoice/getall').post(getInvoicesByUserId)
router.route('/invoice/delete').post(deleteInvoice)
router.route('/invoice/:invoiceId/items').get(getInvoiceItemsById);
module.exports = router