const express = require("express");
const router = express.Router();
const {
  addInvoice,
  getInvoicesByUserId,
  deleteInvoice,
  getInvoiceItemsById,
} = require("../controllers/invoice");
const { authMiddleware } = require("../middleware/authValidators");

router.route("/add").post(authMiddleware, addInvoice);
router.route("/getall").get(authMiddleware, getInvoicesByUserId);
router.route("/delete/:invoiceId").delete(authMiddleware, deleteInvoice);
router
  .route("/:invoiceId/items")
  .get(authMiddleware, getInvoiceItemsById);
module.exports = router;
