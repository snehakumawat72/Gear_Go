import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import AvailabilityCalendar from '../components/AvailabilityCalendar'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const CarDetails = () => {
  const { id } = useParams()
  const {
    cars,
    axios,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    user,
  } = useAppContext()

  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(false)
  const currency = import.meta.env.VITE_CURRENCY || "₹"

  // State to hold the detailed pricing breakdown
  const [pricingDetails, setPricingDetails] = useState(null);

  // --- DYNAMIC PRICING LOGIC ---
  useEffect(() => {
    if (!pickupDate || !returnDate || !car) {
      setPricingDetails(null);
      return;
    }

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);

    if (rDate <= pDate) {
      setPricingDetails(null);
      return;
    }

    const noOfDays = Math.ceil((rDate - pDate) / (1000 * 60 * 60 * 24));

    if (noOfDays <= 0) {
      setPricingDetails(null);
      return;
    }

    const baseAmount = car.pricePerDay * noOfDays;
    let urgentBookingFee = 0;
    let weekendSurcharge = 0;
    let longTermDiscount = 0;

    // 1. Urgent Booking Surcharge (15% if pickup is within 2 days)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date
    const daysUntilPickup = (pDate - today) / (1000 * 60 * 60 * 24);
    if (daysUntilPickup < 2) {
      urgentBookingFee = baseAmount * 0.15;
    }

    // 2. Weekend Surcharge (10% if booking includes Fri, Sat, or Sun)
    let includesWeekend = false;
    for (let i = 0; i < noOfDays; i++) {
      const currentDay = new Date(pDate.getTime() + i * (1000 * 60 * 60 * 24)).getDay();
      if ([0, 5, 6].includes(currentDay)) { // 0:Sun, 5:Fri, 6:Sat
        includesWeekend = true;
        break;
      }
    }
    if (includesWeekend) {
      weekendSurcharge = baseAmount * 0.10;
    }

    // 3. Long-Term Discount (10% for 7+ days, 20% for 30+ days)
    if (noOfDays >= 30) {
      longTermDiscount = baseAmount * 0.20;
    } else if (noOfDays >= 7) {
      longTermDiscount = baseAmount * 0.10;
    }

    const totalAmount = baseAmount + urgentBookingFee + weekendSurcharge - longTermDiscount;
    setPricingDetails({
      noOfDays,
      baseAmount,
      urgentBookingFee,
      weekendSurcharge,
      longTermDiscount,
      totalAmount
    });

  }, [pickupDate, returnDate, car]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const totalAmount = pricingDetails?.totalAmount;

    // Validation
    if (!totalAmount || totalAmount <= 0) {
      toast.error("Please select valid dates to calculate the price.");
      return;
    }

    if (!user?.name || !user?.email || !user?.phone) {
      toast.error("Please complete your profile (name, email, phone) before booking.");
      return;
    }

    // Check availability
    const checkingAvailability = await axios.post('/api/bookings/check-availability', {
      car: id,
      pickupDate,
      returnDate,
    });

    if (!checkingAvailability.data.success) {
      toast.error(checkingAvailability.data.message || "Car is not available for the selected dates.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create Razorpay order
      const { data: orderData } = await axios.post("/api/payment/create-order", {
        amount: totalAmount,
      });

      if (!orderData.success) {
        toast.error("Failed to create payment order");
        setLoading(false);
        return;
      }

      // Step 2: Create pending booking
      const { data: pendingBookingData } = await axios.post("/api/bookings/create-pending", {
        car: id,
        pickupDate,
        returnDate,
        totalAmount,
        customerDetails: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        orderId: orderData.order.id,
      });

      if (!pendingBookingData.success) {
        toast.error("Failed to create booking reservation");
        setLoading(false);
        return;
      }

      const bookingId = pendingBookingData.bookingId;
      const expiresAt = new Date(pendingBookingData.expiresAt);

      // Step 3: Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TJJgTw6mzJZ1sR",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "GearGo Rentals",
        description: `Booking for ${car.brand} ${car.model}`,
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Step 4: Confirm booking after successful payment
            const { data } = await axios.post("/api/bookings/confirm", {
              bookingId,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (data.success) {
              toast.success("Booking confirmed successfully!");
              navigate("/my-bookings");
            } else {
              toast.error(data.message || "Failed to confirm booking");
            }
          } catch (err) {
            console.error('Confirmation error:', err);
            toast.error("Booking confirmation failed. Please contact support.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#6366f1",
        },
        modal: {
          ondismiss: function () {
            const timeLeft = Math.round((expiresAt - new Date()) / (1000 * 60));
            if (timeLeft > 0) {
              toast.info(`Payment cancelled. Your booking reservation will expire in ${timeLeft} minutes.`);
            } else {
              toast.info("Payment cancelled. Your booking reservation may have expired.");
            }
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error("Something went wrong during payment initiation.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cars && cars.length > 0) {
      const selectedCar = cars.find((c) => c._id === id);
      if (selectedCar) {
        setCar(selectedCar);
      } else {
        toast.error("Car not found.");
      }
    }
  }, [cars, id]);

  const getMinReturnDate = () => {
    if (!pickupDate) return '';
    const nextDay = new Date(pickupDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  };

  {/* Reusable component for consistent section styling */ }
  const DetailSection = ({ title, children }) => (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  );

  return car ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
        Back to all cars
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='lg:col-span-2'
        >
          <motion.img
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={car.image}
            alt={`${car.brand} ${car.model}`}
            className='w-full h-auto object-cover rounded-xl mb-6 shadow-lg'
          />
          <motion.div
            className='space-y-8'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className='text-4xl font-bold text-gray-900'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg mt-1'>{car.category} • {car.year}</p>
            </div>
            {/* <hr className='border-gray-200' /> */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className='flex flex-col items-center text-center p-3 border border-gray-200 rounded-lg transition-all duration-300 hover:shadow-md hover:border-primary'
                >
                  <img src={icon} alt='' className='h-6 mb-2 text-primary' />
                  <span className='text-sm text-gray-700 font-medium'>{text}</span>
                </div>
              ))}
            </div>

            {/* Description Section - USING REUSABLE COMPONENT */}
            <DetailSection title="Description">
              <p className='text-gray-600 leading-relaxed'>{car.description}</p>
            </DetailSection>

            <DetailSection title="Features">
              <ul className='grid grid-cols-2 gap-x-6 gap-y-3'>
                {/* NOTE: look into it */}
                {/* Assumes car.features is an array of strings. Provides a fallback. */}
                {(car.features || ["Bluetooth", "GPS", "Heated Seats", "Sunroof", "USB Input"]).map((item) => (
                  <li key={item} className='flex items-center text-gray-600'>
                    <img src={assets.check_icon} className='h-4 w-4 mr-3' alt='check mark' />
                    {item}
                  </li>
                ))}
              </ul>
            </DetailSection>

          </motion.div>
        </motion.div>

        {/* --- RIGHT SECTION (BOOKING) --- UI UPDATED FOR DYNAMIC PRICING --- */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='shadow-lg h-max sticky top-24 rounded-xl p-6 space-y-4 text-gray-500'
        >
          <p className='flex items-baseline justify-between text-2xl text-gray-800 font-semibold'>
            <span>
              {currency}{car.pricePerDay}
              <span className='text-base text-gray-400 font-normal'>/day</span>
            </span>
            <span className='text-sm font-normal text-gray-400'>Base Rate</span>
          </p>

          <hr className='border-borderColor' />

          {/* Calendar Component */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium text-gray-800 mb-4'>Check Availability</h3>
            <AvailabilityCalendar 
              carId={id}
              onDateSelect={(date) => {
                if (!pickupDate || (pickupDate && returnDate)) {
                  // Set pickup date first or reset both dates
                  setPickupDate(date)
                  setReturnDate('')
                } else if (pickupDate && !returnDate) {
                  // Set return date if pickup is already set
                  const pickup = new Date(pickupDate)
                  const selected = new Date(date)
                  if (selected > pickup) {
                    setReturnDate(date)
                  } else {
                    // If selected date is before pickup, swap them
                    setPickupDate(date)
                    setReturnDate(pickupDate)
                  }
                }
              }}
              selectedPickup={pickupDate}
              selectedReturn={returnDate}
            />
          </div>

          <hr className='border-borderColor' />

          <div className='flex flex-col gap-2'>
            <label htmlFor='pickup-date'>Pickup Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type='date'
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
              id='pickup-date'
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='return-date'>Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type='date'
              className='border border-borderColor px-3 py-2 rounded-lg'
              required
              id='return-date'
              min={getMinReturnDate()}
            />
          </div>

          {/* Dynamic Price Breakdown Section */}
          {pricingDetails && pricingDetails.totalAmount > 0 && (
            <div className='space-y-2 border-t border-b border-borderColor py-4 my-2 text-sm'>
              <h3 className='text-base font-medium text-gray-700 mb-2'>Price Breakdown</h3>
              <div className='flex justify-between'>
                <p>{currency}{car.pricePerDay} x {pricingDetails.noOfDays} day{pricingDetails.noOfDays > 1 ? 's' : ''}</p>
                <p>{currency}{pricingDetails.baseAmount.toFixed(2)}</p>
              </div>

              {pricingDetails.urgentBookingFee > 0 && (
                <div className='flex justify-between text-orange-600'>
                  <p>Urgent Booking Fee (15%)</p>
                  <p>+ {currency}{pricingDetails.urgentBookingFee.toFixed(2)}</p>
                </div>
              )}
              {pricingDetails.weekendSurcharge > 0 && (
                <div className='flex justify-between text-orange-600'>
                  <p>Weekend Surcharge (10%)</p>
                  <p>+ {currency}{pricingDetails.weekendSurcharge.toFixed(2)}</p>
                </div>
              )}
              {pricingDetails.longTermDiscount > 0 && (
                <div className='flex justify-between text-green-600'>
                  <p>Long-Term Discount</p>
                  <p>- {currency}{pricingDetails.longTermDiscount.toFixed(2)}</p>
                </div>
              )}

              <div className='flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-dashed'>
                <p>Total Amount</p>
                <p>{currency}{pricingDetails.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pricingDetails || pricingDetails.totalAmount <= 0}
            className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {loading ? "Processing..." : "Reserve Now"}
          </button>

          <p className='text-center text-sm'>You won't be charged until you confirm on the next screen.</p>
        </motion.form>
      </div>
    </div>
  ) : <Loader />
}

export default CarDetails;