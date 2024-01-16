const express = require("express");
const { fetchUser, addUserAddress, deleteUserAddress, addWishList, removeWishList, fetchUserWishList } = require("../controllers/userController");
const router = express.Router();

router 
   .get("/fetch", fetchUser)
   .post("/address", addUserAddress)
   .delete("/address", deleteUserAddress)
   .post("/wishlist", addWishList)
   .delete("/wishlist", removeWishList)
   .get("/wishlist", fetchUserWishList)

module.exports = router;