const express = require("express");
const router = express.Router();
const {Register,Login,changePassword, deleteUser} = require('../controllers/auth')
const {authMiddleware} = require('../middleware/authValidators')

router.route('/register').post(Register)
router.route('/login').post(Login)
router.route('/changepassword').patch(authMiddleware, changePassword)
router.route('/delete-user').delete(deleteUser)

module.exports = router