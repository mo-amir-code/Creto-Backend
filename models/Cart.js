const mongoose = require('mongoose');
const {Schema} = mongoose;

const cartSchema = new Schema({
    productId:{type: Schema.Types.ObjectId,required: true, ref: 'Product'},
    purchasedUserId:{type: Schema.Types.ObjectId,required: true, ref: 'User'},
    currentPrice:{type: Number, required: true},
    quantity:{type: Number, required: true},
    color:{type: String, required: true},
    frameSize:{type: String, required: true},
    wheelSize:{type: String, required: true},
});


module.exports = new mongoose.model("Cart", cartSchema);