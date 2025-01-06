const express = require("express");
const router = express.Router();
const {
  addTax,
  getAllTaxesByUserId,
  deleteTaxSlab,
} = require("../controllers/tax");
const { authMiddleware } = require("../middleware/authValidators");

router.route("/add").post(authMiddleware, addTax);
router.route("/getall").get(authMiddleware, getAllTaxesByUserId);
router.route("/delete/:id").delete(authMiddleware, deleteTaxSlab);

module.exports = router;
