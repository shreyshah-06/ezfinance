const express = require("express");
const router = express.Router();
const { addProduct, getProductsByUserId } = require("../controllers/product");
const { authMiddleware } = require("../middleware/authValidators");

router.route("/add").post(authMiddleware, addProduct);
router.route("/getAll").get(authMiddleware, getProductsByUserId);

module.exports = router;
