import { useState } from 'react';
import { useRouter } from 'next/router';

export default function EnhancedRazorpayPayment({ booking }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create order
      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          amount: booking.totalAmount,
        }),
      });

      const order = await response.json();

      // Razorpay options with multiple payment methods
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Gear Go',
        description: `Booking for ${booking.vehicleModel}`,
        order_id: order.id,
        handler: async function (response) {
          // Verify payment
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.bookingId,
            }),
          });

          if (verifyResponse.ok) {
            router.push(`/booking-confirmation/${booking.bookingId}`);
          } else {
            setError('Payment verification failed');
          }
        },
        prefill: {
          name: booking.customerDetails.name,
          email: booking.customerDetails.email,
          contact: booking.customerDetails.phone,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        setError(response.error.description);
      });
      razorpay.open();
    } catch (err) {
      setError('Failed to initiate payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Choose Payment Method</h3>
      
      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="card"
            name="method"
            value="card"
            checked={selectedMethod === 'card'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="card" className="flex items-center space-x-2">
            <span>💳</span>
            <span>Credit/Debit Card</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="upi"
            name="method"
            value="upi"
            checked={selectedMethod === 'upi'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="upi" className="flex items-center space-x-2">
            <span>📱</span>
            <span>UPI</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="netbanking"
            name="method"
            value="netbanking"
            checked={selectedMethod === 'netbanking'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="netbanking" className="flex items-center space-x-2">
            <span>🏦</span>
            <span>Net Banking</span>
          </label>
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="radio"
            id="wallet"
            name="method"
            value="wallet"
            checked={selectedMethod === 'wallet'}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-blue-600"
          />
          <label htmlFor="wallet" className="flex items-center space-x-2">
            <span>💰</span>
            <span>Digital Wallet</span>
          </label>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Amount:</span>
          <span className="text-blue-600">₹{booking.totalAmount}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-3 rounded-md font-medium ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
      >
        {isProcessing ? 'Processing...' : `Pay ₹${booking.totalAmount}`}
      </button>

      <p className="text-sm text-gray-500 mt-2 text-center">
        🔒 Secure payment powered by Razorpay
      </p>
    </div>
  );
}