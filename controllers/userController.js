const User = require("../models/User");
const NodeCache = require("node-cache");
const nodeCache = new NodeCache();

exports.fetchUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const isUser = nodeCache.get(userId);
    if (isUser) {
      return res.status(200).json({
        status: "success",
        message: "User information fetched successfully.",
        data: JSON.parse(isUser),
      });
    }
    const user = await User.findById(userId).select(
      "name email photoUrl wishlist addresses role"
    );
    nodeCache.set(userId, JSON.stringify(user));
    res.status(200).json({
      status: "success",
      message: "User information fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Some Internal Error Occured!",
    });
  }
};

exports.addUserAddress = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: req.body } },
      { new: true }
    );
    const data = user.addresses.at(-1);
    nodeCache.del(userId);
    res.status(200).json({
      status: "success",
      message: "User information fetched successfully.",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Some Internal Error Occured!",
    });
  }
};

exports.deleteUserAddress = async (req, res) => {
  try {
    const { userId, _id } = req.body;
    await User.findByIdAndUpdate(userId, { $pull: { addresses: { _id } } });
    nodeCache.del(userId);
    res.status(200).json({
      status: "success",
      message: "Address has been deleted successfully.",
      data: { userId, _id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Some Internal Error Occured!",
    });
  }
};

exports.addWishList = async (req, res) => {
  try {
    const { userId, _id } = req.body;
    await User.findByIdAndUpdate(userId, { $push: { wishlist: _id } });
    nodeCache.del(userId);
    res.status(200).json({
      status: "success",
      message: "Item added in the wishlist",
      data: { userId, _id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Some Internal Error Occured!",
    });
  }
};

exports.removeWishList = async (req, res) => {
  try {
    const { userId, _id } = req.body;
    await User.findByIdAndUpdate(userId, { $pull: { wishlist: _id } });
    nodeCache.del(userId);
    res.status(200).json({
      status: "success",
      message: "Item removed from the wishlist",
      data: { userId, _id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Some Internal Error Occured!",
    });
  }
};

exports.fetchUserWishList = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).select("wishlist").populate({
      path: "wishlist",
    });
    res.status(200).json({
      status: "success",
      message: "Wishlist fetched successfully",
      data: user.wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Some Internal Error Occured!",
    });
  }
};
