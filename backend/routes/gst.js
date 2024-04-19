const express = require("express");
const router = express.Router();
const {getGstAmtandBills} = require('../controllers/gst')

router.route('/gst/calculate').post(getGstAmtandBills)
module.exports = router