import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
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
  const currency = import.meta.env.VITE_CURRENCY || "₹"
const handleSubmit = async e => {
    e.preventDefault();

    // 1) Date validation
    if (new Date(returnDate) <= new Date(pickupDate)) {
      toast.error('Return date must be after pickup date');
      return;
    }

    // 2) Profile validation
    if (!user?.name || !user?.email || !user?.phone) {
      toast.error('Please complete your profile before booking');
      return;
    }

    // 3) Compute days & total
    const days = Math.ceil(
      (new Date(returnDate) - new Date(pickupDate)) /
      (1000 * 60 * 60 * 24)
    );
    const rate = Number(car.pricePerDay);
    if (!rate || isNaN(rate)) {
      toast.error('Invalid daily price');
      return;
    }
    const totalAmount = days * rate;
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      toast.error('Invalid total amount');
      return;
    }

    // 4) Create order on backend
    try {
      const { data } = await axios.post('/api/bookings/create-order', {
        amount: totalAmount,
        carId: car._id,           // or gearId
        pickupDate,
        returnDate,
        customerDetails: {
          name:  user.name,
          email: user.email,
          phone: user.phone
        }
      });

      if (!data.success) {
        toast.error('Failed to create payment order');
        return;
      }

      const order = data.order;

      // 5) Razorpay options
      const options = {
        key:       import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:    order.amount,      // in paise
        currency:  order.currency,
        order_id:  order.id,
        name:      'earGo Car Rental',
        description: 'Complete your booking',
        prefill: {
          name:    user.name,
          email:   user.email,
          contact: user.phone
        },
        theme: { color: '#6366f1' },
        modal: {
          ondismiss: () => toast.info('Payment popup closed')
        },
        handler: response => {
          // Only UI feedback; booking is created in your webhook
          console.log('💰 Payment Success:', response);
          toast.success('Payment successful! Your booking will be confirmed shortly.');
          navigate('/my-bookings');
        }
      };

      // 6) Open Razorpay
      new window.Razorpay(options).open();
    } catch (err) {
      console.error('❌ create-order error:', err);
      toast.error('Could not initiate payment');
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
        {/* Left Section */}
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
              <h1 className='text-3xl font-bold'>{car.brand} {car.model}</h1>
              <p className='text-gray-500 text-lg'>{car.category} • {car.year}</p>
            </div>

            <hr className='border-borderColor my-6' />

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <motion.div
                  key={text}
                  className='flex flex-col items-center bg-light p-4 rounded-lg'
                >
                  <img src={icon} alt='' className='h-5 mb-2' />
                  {text}
                </motion.div>
              ))}
            </div>

            <div>
              <h1 className='text-xl font-medium mb-3'>Description</h1>
              <p className='text-gray-500'>{car.description}</p>
            </div>

            <div>
              <h1 className='text-xl font-medium mb-3'>Features</h1>
              <ul className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map((item) => (
                  <li key={item} className='flex items-center text-gray-500'>
                    <img src={assets.check_icon} className='h-4 mr-2' alt='' />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Section (Booking) */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500'
        >
          <p className='flex items-center justify-between text-2xl text-gray-800 font-semibold'>
            {currency}{car.pricePerDay}
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

          <button
  type="button"
  onClick={handleSubmit}
  className="w-full bg-primary …"
>
  Book Now
</button>


          <p className='text-center text-sm'>No credit card required to reserve</p>
        </motion.form>
      </div>
    </div>
  ) : <Loader />
}

export default CarDetails
