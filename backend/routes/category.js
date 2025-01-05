const express = require("express");
const router = express.Router();
const {addCategory,getAllCategoriesByUserId,deleteCategory} = require('../controllers/category')
const { authMiddleware } = require("../middleware/authValidators");

router.route('/category/add').post(authMiddleware, addCategory)
router.route('/category/getall').get(authMiddleware, getAllCategoriesByUserId)
router.route('/category/delete/:id').delete(authMiddleware, deleteCategory)

module.exports = router