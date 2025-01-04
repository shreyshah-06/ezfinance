const express = require("express");
const router = express.Router();
const {
  addTax,
  getAllTaxesByUserId,
  deleteTaxSlab,
} = require("../controllers/tax");
const { authMiddleware } = require("../middleware/authValidators");

router.route("/tax/add").post(authMiddleware, addTax);
router.route("/tax/getall").get(authMiddleware, getAllTaxesByUserId);
router.route("/tax/delete/:id").delete(authMiddleware, deleteTaxSlab);

module.exports = router;
