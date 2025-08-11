import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CarCard from '../components/CarCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Cars = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get('pickupLocation');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const { cars = [], axios } = useAppContext();
  const [input, setInput] = useState('');
  const [filteredCars, setFilteredCars] = useState([]);

  const isSearchData = pickupLocation && pickupDate && returnDate;

  const applyFilter = () => {
    if (!input) {
      setFilteredCars(cars);
      return;
    }

    const filtered = cars.filter((car) =>
      [car.brand, car.model, car.category, car.transmission]
        .some((field) => field?.toLowerCase().includes(input.toLowerCase()))
    );

    setFilteredCars(filtered);
  };

  const searchCarAvailability = async () => {
    try {
      const { data } = await axios.post('/api/bookings/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        const available = data.availableCars || [];
        setFilteredCars(available);

        if (available.length === 0) {
          toast('No cars available');
        }
      } else {
        toast.error(data.message || 'Failed to fetch cars');
      }
    } catch (err) {
      console.error('Error checking car availability:', err.message);
      toast.error('Error checking car availability');
    }
  };

  useEffect(() => {
    if (isSearchData) {
      searchCarAvailability();
    }
  }, []);

  useEffect(() => {
    if (!isSearchData) {
      applyFilter();
    }
  }, [input, cars]);

  return (
    // <div className='mt-[-80px]'>
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex flex-col items-center py-14 bg-light max-md:px-4 text-light'
        // style={{ backgroundImage: `url(${"https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg"})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        style={{ backgroundImage: `url(${"https://images.pexels.com/photos/57645/pexels-photo-57645.jpeg"})`, backgroundSize: 'cover', backgroundPosition: 'end' }}

      >
        <Title
          title='Available Cars'
          subTitle='Browse our selection of premium vehicles available for your next adventure'
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='flex items-center bg-white px-4 mt-6 max-w-140 w-full h-12 rounded-full shadow'
        >
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type='text'
            placeholder='Search by make, model, or features'
            className='w-full h-full outline-none text-gray-500'
          />
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 ml-2' />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className='px-6 md:px-16 lg:px-24 xl:px-32 mt-10'
      >
        <p className='text-gray-500 xl:px-20 max-w-7xl mx-auto'>
          Showing {filteredCars?.length || 0} Cars
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredCars?.map((car, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
