const express = require('express');
const { createPromotion, getPromotion } = require('../controllers/promotionController');
const router = express.Router();


router
   .post("/create", createPromotion)
   .get("/promotions", getPromotion)

module.exports = router;