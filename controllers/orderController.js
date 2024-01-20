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
