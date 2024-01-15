const express = require("express");
const router = express.Router();
const authRouter = require("./authRouter");
const productRouter = require("./productRouter");
const promotionRouter = require("./promotionRouter");
const userRouter = require("./userRouter");

router.use("/auth", authRouter);
router.use("/product", productRouter);
router.use("/promotion", promotionRouter);
router.use("/user", userRouter);


module.exports = router;
