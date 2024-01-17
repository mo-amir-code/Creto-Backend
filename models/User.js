const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  uid: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photoUrl: { type: String },
  password: { type: String, required: true },
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  addresses: [
    {
      name: { type: String },
      email: { type: String },
      address: { type: String },
      country: { type: String },
      state: { type: String },
      city: { type: String },
      postalCode: { type: Number },
      mobileNo: { type: Number },
    },
  ],
  verified: { type: Boolean, default: false },
  role: { type: String, default: "user", enum: ["user", "admin"] },
  otp: { type: String },
  otpExpiry: { type: Number },
  otpToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpiry: { type: Number },
  sessionToken: { type: String },
});

module.exports = new mongoose.model("User", userSchema);
