const express = require("express");
const { getAll, addToCart, editCart, deleteCart, addProduct, getProductById, getCartCount, getCartData, searchByQuery, getTopSell, getRelatedProducts, searchQuery } = require("../controllers/productController");
const router = express.Router();

router  
  .get("/all", getAll)
  .get("/top-sell", getTopSell)
  .get("/pid/:productId", getProductById)
  .get("/related", getRelatedProducts)
  .get("/cart-count", getCartCount)
  .get("/cart-data", getCartData)
  .post("/add-to-cart", addToCart)
  .post("/add", addProduct)
  .patch("/cart-edit", editCart)
  .delete("/cart/:cartId", deleteCart)
  .get("/search", searchByQuery)
  .get("/search-type", searchQuery)

module.exports = router;