const express = require("express");
const router = express.Router();
const {
  addInvoice,
  getInvoicesByUserId,
  deleteInvoice,
  getInvoiceItemsById,
} = require("../controllers/invoice");
const { authMiddleware } = require("../middleware/authValidators");

router.route("/invoice/add").post(authMiddleware, addInvoice);
router.route("/invoice/getall").get(authMiddleware, getInvoicesByUserId);
router.route("/invoice/delete/:invoiceId").delete(authMiddleware, deleteInvoice);
router
  .route("/invoice/:invoiceId/items")
  .get(authMiddleware, getInvoiceItemsById);
module.exports = router;
