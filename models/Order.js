const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  purchasedUserId: {type: Schema.Types.ObjectId, required: true, ref: "User"},
  orderItems: [
    {
      productId: {type: Schema.Types.ObjectId, ref: "Product", requireduired: true},
      currentPrice: { type: Number, required: true },
      quantity: { type: Number, required: true },
      color: { type: String, required: true },
      frameSize: { type: String, required: true },
      wheelSize: { type: String, required: true },
    },
  ],
  deliveryAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: Number, required: true },
    mobileNo: { type: Number, required: true },
  },
  orderStatus: {
    type: String,
    default: "pending",
    enum: ["pending", "dispatched", "shipped", "delivered"],
  },
  paymentMode: { type: String, enum: ["card", "upi", "cash"], required: true },
  totalAmount: { type: Number, required:true },
}, {timestamps: true});

module.exports = new mongoose.model("Order", orderSchema);
