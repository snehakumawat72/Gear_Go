import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currency = '₹'; // or '$' or use booking.currency

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log('Fetching bookings...');
        const res = await axios.get('/api/bookings/user'); // Your actual API route
        console.log('Bookings fetched:', res.data);
        if (res.data.success) {
          setBookings(res.data.bookings);
        } else {
          console.error('Failed to fetch bookings');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading your bookings...</p>;

  if (!bookings.length) return <p className="text-center mt-10">No bookings found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => {
            const item = booking.item || booking.vehicle || {};
            return (
              <div
                key={booking._id}
                className="border border-gray-300 rounded-lg shadow hover:shadow-lg transition p-4 md:flex gap-4"
              >
                {/* Vehicle Image */}
                <div className="w-full md:w-1/3">
                  <img
                    src={item.image}
                    alt={item.brand || item.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>

                {/* Booking Details */}
                <div className="w-full md:w-2/3">
                  <h3 className="text-xl font-semibold">
                    {item.brand ? `${item.brand} ${item.model}` : item.name}
                  </h3>

                  <p className="text-sm text-gray-500 mb-2">
                    {item.year && `${item.year} • `}
                    {item.fuel_type} • {item.transmission}
                  </p>

                  <p className="mb-1">
                    <strong>Seating:</strong> {item.seating_capacity || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Location:</strong>{" "}
                    {booking.pickupLocation || item.location || "N/A"}
                  </p>

                  <p className="mb-1">
                    <strong>Booking Dates:</strong>{" "}
                    {new Date(booking.startDate).toLocaleDateString()} →{" "}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </p>

                  <p className="mb-1">
                    <strong>Total Amount:</strong>{" "}
                    {currency}
                    {booking.totalAmount.toFixed(2)}
                  </p>

                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`font-medium ${
                        booking.status === "confirmed"
                          ? "text-green-600"
                          : booking.status === "cancelled"
                          ? "text-red-500"
                          : "text-yellow-600"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </p>

                  <p className="mb-1">
                    <strong>Payment:</strong>{" "}
                    <span
                      className={`font-medium ${
                        booking.paymentStatus === "paid"
                          ? "text-green-600"
                          : booking.paymentStatus === "failed"
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                    >
                      {booking.paymentStatus}
                    </span>
                  </p>

                  {/* Payment Extra Info */}
                  {booking.payment && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>💳 Method: {booking.payment.method || "N/A"}</p>
                      <p>
                        🧾 Amount: {currency}
                        {booking.payment.amount || 0}
                      </p>
                    </div>
                  )}

                  {/* Description (optional) */}
                  {item.description && (
                    <details className="mt-3 text-sm text-gray-700">
                      <summary className="cursor-pointer text-blue-600">
                        Show Vehicle Description
                      </summary>
                      <p className="mt-1 whitespace-pre-line">
                        {item.description}
                      </p>
                    </details>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
