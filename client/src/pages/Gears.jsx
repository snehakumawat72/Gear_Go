import React, { useEffect, useState } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import GearCard from '../components/owner/GearCard';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Gears = () => {
  const [searchParams] = useSearchParams();
  const pickupLocation = searchParams.get('pickupLocation');
  const pickupDate = searchParams.get('pickupDate');
  const returnDate = searchParams.get('returnDate');

  const { gears = [], axios } = useAppContext();

  const [input, setInput] = useState('');
  const isSearchData = pickupLocation && pickupDate && returnDate;
  const [filteredGears, setFilteredGears] = useState([]);

  const applyFilter = () => {
    if (!input) {
      setFilteredGears(gears);
      return;
    }

    const filtered = gears.filter((gear) =>
      [gear.name, gear.category, gear.description]
        .some((field) => field?.toLowerCase().includes(input.toLowerCase()))
    );

    setFilteredGears(filtered);
  };

  const searchGearAvailability = async () => {
    try {
      const { data } = await axios.post('/api/gears/check-availability', {
        location: pickupLocation,
        pickupDate,
        returnDate,
      });

      if (data.success) {
        const available = data.availableGears || [];
        setFilteredGears(available);

        if (available.length === 0) {
          toast('No gears available');
        }
      } else {
        toast.error(data.message || 'Failed to fetch gear availability');
      }
    } catch (error) {
      console.error('Error checking gear availability:', error.message);
      toast.error('Error fetching gear availability');
    }
  };

  useEffect(() => {
    if (isSearchData) {
      searchGearAvailability();
    }
  }, [pickupLocation, pickupDate, returnDate]);

  useEffect(() => {
    if (!isSearchData) {
      applyFilter();
    }
  }, [input, gears]);

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='flex flex-col items-center py-20 bg-light max-md:px-4 text-light bg-cover bg-center'
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.5), rgba(37, 99, 235, 0.2)),
          url('https://images.pexels.com/photos/190537/pexels-photo-190537.jpeg')
           `        }}
      >
        <Title
          title='Available Trip Gears'
          subTitle='Browse high-quality gear to elevate your adventure'
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
            type="text"
            placeholder='Search by gear name, category, or features'
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
          Showing {filteredGears?.length || 0} Gears
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto'>
          {filteredGears?.map((gear, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <GearCard gear={gear} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Gears;
