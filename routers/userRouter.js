const express = require("express");
const { fetchUser, addUserAddress, deleteUserAddress } = require("../controllers/userController");
const router = express.Router();

router 
   .get("/fetch", fetchUser)
   .post("/address", addUserAddress)
   .delete("/address", deleteUserAddress)

module.exports = router;