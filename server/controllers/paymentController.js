import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};
