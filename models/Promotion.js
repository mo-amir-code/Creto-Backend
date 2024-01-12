const mongoose = require("mongoose");
const { Schema } = mongoose;

const promtionSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true, ref: "product" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    promotionExpiry: { type: Date, required: true },
    days:{type:Number, required: true}
  },
  {
    timestamps: true,
  }
);

module.exports = new mongoose.model("Promotion", promtionSchema);
