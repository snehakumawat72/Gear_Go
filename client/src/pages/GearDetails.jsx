import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

const GearDetails = () => {
  const { id } = useParams()

  const {
    axios,
    gears,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    user,
  } = useAppContext()

  const navigate = useNavigate()
  const [gear, setGear] = useState(null)
  const currency = import.meta.env.VITE_CURRENCY || "₹"
const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("🎒 Submitting gear booking");

  if (new Date(returnDate) <= new Date(pickupDate)) {
    console.log("❌ Invalid dates:", { pickupDate, returnDate });
    toast.error("Return date must be after pickup date");
    return;
  }

  if (!user?.name || !user?.email || !user?.phone) {
    console.log("❌ Incomplete user profile:", user);
    toast.error("Please complete your profile (name, email, phone) before booking.");
    return;
  }

  if (!gear || gear.pricePerDay == null || isNaN(Number(gear.pricePerDay))) {
    console.log("❌ Invalid gear pricing data:", gear);
    toast.error("Invalid gear pricing data.");
    return;
  }

  const noOfDays = Math.ceil(
    (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
  );

  if (noOfDays <= 0) {
    console.log("❌ Invalid number of days:", noOfDays);
    toast.error("Invalid booking duration.");
    return;
  }

  const totalAmount = Number(gear.pricePerDay) * noOfDays;

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    console.log("❌ Invalid total amount:", totalAmount);
    toast.error("Invalid total amount calculated. Please check your dates or gear price.");
    return;
  }

  console.log("✅ All validations passed. Creating Razorpay order for ₹", totalAmount);

  try {
    const { data: orderData } = await axios.post("/api/payment/create-order", {
      amount: totalAmount,
    });

    console.log("📦 Razorpay Order Data:", orderData);

    if (!orderData.success) {
      toast.error("Failed to create Razorpay order");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_TJJgTw6mzJZ1sR",
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "GearGo Rentals",
      description: "Gear Rental Payment",
      order_id: orderData.order.id,
      handler: async function (response) {
        console.log("💰 Razorpay Payment Success:", response);
        try {
          const { data } = await axios.post("/api/bookings/create", {
            gear: id,
            pickupDate,
            returnDate,
            customerDetails: {
              name: user.name,
              email: user.email,
              phone: user.phone,
            },
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });

          if (data.success) {
            toast.success("Booking confirmed!");
            navigate("/my-bookings");
          } else {
            console.log("❌ Booking error after payment:", data);
            toast.error(data.message);
          }
        } catch (err) {
          console.error("❌ Booking API failed:", err.message);
          toast.error("Booking failed after payment");
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
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error.message);
    toast.error("Something went wrong during payment initiation.");
  }
};


  useEffect(() => {
    setGear(gears.find((item) => item._id === id))
  }, [gears, id])

  return gear ? (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>

      <button
        onClick={() => navigate(-1)}
        className='flex items-center gap-2 mb-6 text-gray-500 cursor-pointer'
      >
        <img src={assets.arrow_icon} alt='' className='rotate-180 opacity-65' />
        Back to all gear
      </button>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12'>
        {/* Left: Gear Image & Details */}
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
            src={gear.image}
            alt=''
            className='w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md'
          />

          <motion.div
            className='space-y-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div>
              <h1 className='text-3xl font-bold'>{gear.title}</h1>
              <p className='text-gray-500 text-lg'>{gear.category}</p>
            </div>

            <hr className='border-borderColor my-6' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.brand_icon, text: gear.brand },
                { icon: assets.location_icon, text: gear.location },
                { icon: assets.condition_icon, text: gear.condition },
                { icon: assets.warranty_icon, text: gear.warranty || "No Warranty" },
              ].map(({ icon, text }) => (
                <motion.div key={text} className='flex flex-col items-center bg-light p-4 rounded-lg'>
                  <img src={icon} alt='' className='h-5 mb-2' />
                  {text}
                </motion.div>
              ))}
            </div>

            <div>
              <h1 className='text-xl font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{gear.description}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: Booking Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'
        >
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{gear.pricePerDay}
            <span className='text-base text-gray-400 font-normal'>per day</span>
          </p>

          <hr className='border-borderColor my-6' />

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
            />
          </div>

          <button className='w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl cursor-pointer'>
            Book Now
          </button>

          <p className='text-center text-sm'>No credit card required to reserve</p>
        </motion.form>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

export default GearDetails
