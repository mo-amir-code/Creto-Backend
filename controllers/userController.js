const User = require("../models/User");

exports.fetchUser = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).select(
      "name email photoUrl wishlist addresses role"
    );
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
