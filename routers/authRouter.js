const express = require("express");
const { signup, signin, sendOTP, verify, signinWithGoogle } = require("../controllers/authController");
const router = express.Router();

router  
  .post("/signup", signup, sendOTP)
  .post("/signin", signin)
  .post("/verify", verify)
  .post("/signin-with-google", signinWithGoogle)

module.exports = router;