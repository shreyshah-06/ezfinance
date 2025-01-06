const express = require("express");
const router = express.Router();
const {getGstAmtandBills} = require('../controllers/gst')

router.route('/calculate').post(getGstAmtandBills)
module.exports = router