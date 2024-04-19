const express = require("express");
const router = express.Router();
const {Register,Login,changePassword} = require('../controllers/auth')

router.route('/register').post(Register)
router.route('/login').post(Login)
router.route('/changepassword/:userId').post(changePassword)

module.exports = router