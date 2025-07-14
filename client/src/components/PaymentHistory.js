import { useState, useEffect } from 'react';

export default function PaymentHistory({ userId }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPayments();
  }, [page]);

  const fetchPayments = async () => {
    try {
      const response = await fetch(`/api/payments/history?userId=${userId}&page=${page}`);
      const data = await response.json();
      setPayments(data.payments);
      setTotalPages(data.pages);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'refunded': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Payment History</h2>
      
      {payments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No payment history found
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">
                      {payment.booking?.vehicleModel || 'Vehicle Booking'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Payment ID: {payment.paymentId}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold">₹{payment.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p>{new Date(payment.paymentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Method</p>
                    <p className="capitalize">{payment.method || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Booking</p>
                    <p>{payment.bookingId}</p>
                  </div>
                </div>
                
                {payment.status === 'refunded' && (
                  <div className="mt-3 p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-800">
                      Refunded: ₹{payment.refundAmount}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center space-x-2 mt-6">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}