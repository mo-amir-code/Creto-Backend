const Product = require("../models/Product");
const Cart = require("../models/Cart");
const User = require("../models/User");
const NodeCache = require("node-cache")
const nodeCache = new NodeCache()

exports.getAll = async (req, res) => {
  try {
    const cachedProducts = nodeCache.get("all-products");
    if(cachedProducts){
      return res.status(200).json({
        status: "success",
        message: "Fetched all products",
        data: JSON.parse(cachedProducts),
      });
    }

    const products = await Product.find().limit(16);
    nodeCache.set("all-products", JSON.stringify(products));
    
    res.status(200).json({
      status: "success",
      message: "Fetched all products",
      data: products,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.getTopSell = async (req, res) => {
  try {
    const cachedProducts = nodeCache.get("top-sell-products");
    if(cachedProducts){
      return res.status(200).json({
        status: "success",
        message: "Fetched all products",
        data: JSON.parse(cachedProducts),
      });
    }

    const products = await Product.find().sort({sold: -1}).limit(16);
    nodeCache.set("top-sell-products", JSON.stringify(products));
    
    res.status(200).json({
      status: "success",
      message: "Fetched all products",
      data: products,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Product not found!" });
    }
    res.status(200).json({
      status: "error",
      message: "Product fetched successfully",
      data: product,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const { userId } = req.query;
    const cartCount = await Cart.countDocuments({ purchasedUserId: userId });
    res.status(200).json({
      status: "error",
      message: "Product fetched successfully",
      data: { count: cartCount },
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.getCartData = async (req, res) => {
  try {
    const { userId } = req.query;
    const cartData = await Cart.find({ purchasedUserId: userId }).populate({
      path: "productId",
      select: "type specs thumbnail",
    });
    res.status(200).json({
      status: "error",
      message: "Product fetched successfully",
      data: cartData,
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.addProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res
      .status(200)
      .json({ status: "status", message: "Product added successfully" });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      purchasedUserId,
      currentPrice,
      color,
      frameSize,
      wheelSize,
    } = req.body;
    if (!productId.length > 0 || !purchasedUserId.length > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Something went wrong." });
    }
    const isCart = await Cart.findOne({
      $and: [{ productId: productId }, { purchasedUserId: purchasedUserId }],
    });
    if (isCart) {
      if (
        isCart.currentPrice == currentPrice &&
        isCart.color == color &&
        isCart.frameSize == frameSize &&
        isCart.wheelSize == wheelSize
      ) {
        return res
          .status(200)
          .json({ status: "warn", message: "Item already exists in the cart" });
      }
    }
    const cart = new Cart(req.body);
    await cart.save();
    res
      .status(200)
      .json({ status: "success", message: "Item added to the cart." });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.editCart = async (req, res) => {
  try {
    const { cartId, quantity, wishlist } = req.body;
    const cart = await Cart.findByIdAndUpdate(
      cartId,
      { quantity },
      { new: true }
    );
    // if(wishlist){
    //     const user = await User.findById(cart.purchasedUserId);
    //     if(!user.wishlist.contains(wishlist)){
    //         user.wishlist.push(wishlist);
    //         await user.save();
    //     }
    // }else{
    //     await User.findByIdAndUpdate(cart.purchasedUserId, {$pull: {wishlist:wishlist}});
    // }
    res.status(200).json({
      status: "success",
      message: "Item added to cart.",
      data: { id: cartId, quantity: cart.quantity },
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    await Cart.findByIdAndDelete(cartId);
    res.status(200).json({
      status: "success",
      message: "Item deleted successfully",
      data: { cartId },
    });
  } catch (err) {
    console.error(err.message);
    res
      .status(500)
      .json({ status: "errro", message: "Some Internal Error Occured!" });
  }
};

exports.searchByQuery = async (req, res) => {
  try {
    const { sortby, minPrice, maxPrice, categories, color, page, limit } =
      req.query;

    const query = {};

    // Handle price filtering scenarios
    if (minPrice && !maxPrice) {
      query.price = { $gte: Number(minPrice) };
    } else if (!minPrice && maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    } else if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    }

    if (categories) {
      query.type = { $in: categories };
    }

    if (color && color.trim()) {
      // Apply color filter only if provided and not empty
      query.colors = { $in: [color] };
    }

    let products = [];
    let totalCount = 0;

    // Apply filters conditionally
    if (sortby) {
      const validSortOptions = ["new", "top", "lowest", "highest"];
      if (!validSortOptions.includes(sortby)) {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid sort option" });
      }
      switch (sortby) {
        case "new":
          totalCount = await Product.countDocuments(query).sort({ _id: -1 });
          products = await Product.find(query)
            .sort({ _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
          break;
        case "top":
          totalCount = await Product.countDocuments(query).sort({ sold: -1 });
          products = await Product.find(query)
            .sort({ sold: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
          break;
        case "lowest":
          totalCount = await Product.countDocuments(query).sort({ price: 1 });
          products = await Product.find(query)
            .sort({ price: 1 })
            .skip((page - 1) * limit)
            .limit(limit);
          break;
        case "highest":
          totalCount = await Product.countDocuments(query).sort({ price: -1 });
          products = await Product.find(query)
            .sort({ price: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
          break;
      }

      totalCount = await Product.countDocuments(query)
      return res.status(200).json({
        status: "success",
        message: "Filtered all products",
        data: products,
        totalCount
      });
    }

    products = await Product.find(query)
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({
      status: "success",
      message: "Filtered all products",
      data: products,
      totalCount
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

