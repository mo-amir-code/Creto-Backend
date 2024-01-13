const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    title:{type: String, required: true},
    description:{type: String},
    stock:{type: Number, require: true},
    price:{type: Number, required: true},
    discount:{type: Number, default: 0},
    colors:[{type: String}],
    sold:{type: Number, default: 0},
    thumbnail:{type: String},
    images:[{type: String}],
    type:{type: String, enum: ["road", "mountain", "bmx", "city", "kids"], required: true},
    brand:{type: String, enum: ["bianchi", "bmc", "trek", "hero", "avon"], required: true},
    productUserId:{type: Schema.Types.ObjectId, ref: 'User', required: true},
    specs:{
        frameSize:[{type:String}], 
        wheelSize:[{type:Number}], 
        class:{type:String}, 
        nos:{type:String}, 
        cr:{type:String}},
    rating: {rate:{type:Number}, count:{type:Number}}
}, {
    timestamps: true
});


module.exports = new mongoose.model("Product", productSchema);