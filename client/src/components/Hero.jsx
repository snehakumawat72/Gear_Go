import React, { useState } from 'react';
import { assets, cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Hero = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const { pickupDate, setPickupDate, returnDate, setReturnDate, navigate } = useAppContext();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen flex flex-col justify-start bg-cover bg-center bg-no-repeat px-6 md:px-20"
      style={{
        backgroundImage: `url(${assets.main_car})`
      }}
    >
      {/* Subtle Overlay */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Main Content */}
      <div className="relative z-10 text-white w-full flex flex-col items-center text-center pt-32 md:pt-40 space-y-6 max-w-6xl mx-auto">

        {/* Heading in One Line */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl md:text-6xl font-black leading-tight text-white mb-4"
        >
          Your Journey, Our Wheels and Gears
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-lg md:text-xl font-medium text-white/90 mb-8"
        >
          Rent and List Cars & Gears — All in One Seamless Experience
        </motion.p>

        {/* Transparent Search Form */}
        <motion.form
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          onSubmit={handleSearch}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 w-full max-w-5xl"
        >
          <div className="flex flex-wrap md:flex-nowrap gap-3 items-end">

            {/* Location */}
            <div className="flex flex-col w-full md:flex-1">
              <label className="text-sm font-semibold text-white mb-2">
                Location
              </label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/70 focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all duration-200"
                required
              >
                <option value="" className="text-gray-800">Select Location</option>
                {cityList.map((city) => (
                  <option key={city} value={city} className="text-gray-800">{city}</option>
                ))}
              </select>
            </div>

            {/* Pickup Date */}
            <div className="flex flex-col w-full md:flex-1">
              <label className="text-sm font-semibold text-white mb-2">
                Pick-up
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all duration-200"
                required
              />
            </div>

            {/* Return Date */}
            <div className="flex flex-col w-full md:flex-1">
              <label className="text-sm font-semibold text-white mb-2">
                Return
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white/50 focus:bg-white/25 transition-all duration-200"
                required
              />
            </div>

            {/* Blue Search Button */}
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all duration-300 w-full md:w-auto justify-center"
            >
              <img src={assets.search_white} alt="search" className="w-4 h-4" />
              Search
            </button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Hero;