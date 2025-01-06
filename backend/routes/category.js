const express = require("express");
const router = express.Router();
const {addCategory,getAllCategoriesByUserId,deleteCategory} = require('../controllers/category')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/add').post(authMiddleware, addCategory)
router.route('/getall').get(authMiddleware, getAllCategoriesByUserId)
router.route('/delete/:id').delete(authMiddleware, deleteCategory)

module.exports = router