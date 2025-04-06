const express = require("express");
const router = express.Router();
const { sendOTP, validateOTP } = require("../controllers/otp");

router.route("/send-otp").post(sendOTP)
router.route("/verify-otp").post(validateOTP)

module.exports = router;