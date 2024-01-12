const express = require("express");
const router = express.Router();
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const promotionRouter = require("./promotionRouter");

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/promotion", promotionRouter);


module.exports = router;
