const express = require('express');
const { makePayment, getAllOrders, deleteOrder } = require('../controllers/orderController');
const router = express.Router();

router
   .post("/make-payment", makePayment)
   .get("/all", getAllOrders)
   .delete("/delete", deleteOrder)

module.exports = router;