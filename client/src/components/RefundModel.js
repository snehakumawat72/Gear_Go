import { useState } from 'react';

export default function RefundModal({ booking, onClose, onRefund }) {
  const [refundAmount, setRefundAmount] = useState(booking.totalAmount);
  const [reason, setReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!reason.trim()) {
      newErrors.reason = 'Please provide a reason for refund';
    }
    
    if (!refundAmount || refundAmount <= 0) {
      newErrors.refundAmount = 'Refund amount must be greater than 0';
    }
    
    if (refundAmount > booking.totalAmount) {
      newErrors.refundAmount = 'Refund amount cannot exceed booking total';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRefund = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/refunds/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.bookingId,
          refundAmount: parseFloat(refundAmount),
          reason: reason.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onRefund(data);
        onClose();
      } else {
        setErrors({ submit: data.message || 'Refund failed. Please try again.' });
      }
    } catch (error) {
      console.error('Refund error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setRefundAmount(value);
    
    // Clear amount error when user starts typing
    if (errors.refundAmount) {
      setErrors(prev => ({ ...prev, refundAmount: '' }));
    }
  };

  const handleReasonChange = (e) => {
    const value = e.target.value;
    setReason(value);
    
    // Clear reason error when user starts typing
    if (errors.reason) {
      setErrors(prev => ({ ...prev, reason: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Process Refund</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={isProcessing}
          >
            ×
          </button>
        </div>
        
        {/* Booking Details */}
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-600">Booking ID: {booking.bookingId}</p>
          <p className="text-sm text-gray-600">Total Amount: ${booking.totalAmount}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Refund Amount</label>
            <input
              type="number"
              value={refundAmount}
              onChange={handleAmountChange}
              max={booking.totalAmount}
              min="0"
              step="0.01"
              className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.refundAmount ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isProcessing}
            />
            {errors.refundAmount && (
              <p className="text-red-500 text-sm mt-1">{errors.refundAmount}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Maximum refund: ${booking.totalAmount}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Reason</label>
            <textarea
              value={reason}
              onChange={handleReasonChange}
              className={`w-full border rounded-md px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.reason ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter reason for refund..."
              disabled={isProcessing}
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
          </div>
        </div>
        
        {errors.submit && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.submit}
          </div>
        )}
        
        <div className="flex space-x-4 mt-6">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRefund}
            disabled={isProcessing}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Process Refund'}
          </button>
        </div>
      </div>
    </div>
  );
}