export const initiateRazorpay = async ({ amount, orderId, user, onSuccess }) => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TJJgTw6mzJZ1sR", // fallback
    amount: amount * 100,
    currency: "INR",
    name: "GearGo Rentals",
    description: "Gear/Car Booking Payment",
    image: "/logo.png", // optional
    order_id: orderId,
    handler: async function (response) {
      // Razorpay sends back payment_id, order_id, signature
      onSuccess(response);
    },
    prefill: {
      name: user.name,
      email: user.email,
    },
    theme: {
      color: "#3399cc",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
export const verifyRazorpayPayment = async (data) => {
  const response = await fetch("/api/verify-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Payment verification failed");
  }

  return response.json();
};