const Promotion = require("../models/Promotion");
const { dayMilliSeconds } = require("../services/constant");

exports.createPromotion = async (req, res) => {
    try {
        const {productId, title, description, image, amount} = req.body;

        if(!productId || !title || !description || !image || !amount) {
            return res.status(404).json({
                status: "error",
                message: "Please fill all the fields"
            });
        }

        const days = amount;

        await new Promotion({...req.body, promotionExpiry:Date.now() + dayMilliSeconds, days: amount}).save();
        res.status(201).json({ status: "success", message: "Promotion created successfully, It will be shown soon"});
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

exports.getPromotion = async (req, res) => {
    try {
        const currentTime = Date.now();
        const promotions = await Promotion.find({promotionExpiry: {$gt: currentTime}}).select("title description image productId").limit(7);
        res.status(200).json({status: "success", message: "Promotions fetched successfully", data:promotions});
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}