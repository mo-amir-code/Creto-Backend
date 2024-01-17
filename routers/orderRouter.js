const express = require('express');
const { makePayment } = require('../controllers/orderController');
const router = express.Router();

router
   .post("/make-payment", makePayment)

module.exports = router;