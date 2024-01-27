require("dotenv/config");
const Order = require("../models/Order");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.makePayment = async (req, res) => {
  try {
    const orderData = req.body;
    await Order.create(orderData);

    const lineItems = orderData.orderItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
        },
        unit_amount: item.currentPrice * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_ORIGIN}/user/cart/checkout/payment/success`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/user/cart/checkout/payment/cancel`,
    });

    res.status(200).json({
      status: "success",
      message: "Session created successfully",
      data: { id: session.id },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Some Internal Error Occured!",
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const {userId} = req.query;

    if(!userId){
      return res.status(400).json({
        status: "error",
        message: "Some Internal Error Occured!",
      });
    }

    const orders = await Order.find({purchasedUserId: userId}).select("-purchasedUserId -updatedAt").populate({path:'orderItems.productId', select: "thumbnail title"});
    
    res.status(200).json({
      status: "success",
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Some Internal Error Occured!",
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const {orderId} = req.body;

    if(!orderId){
      return res.status(400).json({
        status: "error",
        message: "Some Internal Error Occured!",
      });
    }

   await Order.findByIdAndDelete(orderId);
    
    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
      data: {orderId},
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Some Internal Error Occured!",
    });
  }
};
