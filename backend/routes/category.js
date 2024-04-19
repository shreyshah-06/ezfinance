const express = require("express");
const router = express.Router();
const {addCategory,getAllCategoriesByUserId,deleteCategory} = require('../controllers/category')

router.route('/category/add').post(addCategory)
router.route('/category/getall').post(getAllCategoriesByUserId)
router.route('/category/delete').post(deleteCategory)

module.exports = router