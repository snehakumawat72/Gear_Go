import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-center justify-between px-6 md:px-14 py-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] max-w-6xl mx-4 md:mx-auto rounded-2xl overflow-hidden shadow-md"
    >
      {/* Left Text Section */}
      <div className="text-white max-w-xl">
        <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
          Earn with Your Car & Travel Gear
        </h2>
        <p className="text-white text-base mb-2">
          Rent out your luxury vehicle or camping gear and generate income effortlessly.
        </p>
        <p className="text-white text-sm mb-5">
          We manage user verification and secure payments — you earn without the hassle.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/owner/add-car')}
            className="px-5 py-2 bg-white text-[#0558FE] border border-white hover:bg-blue-100 transition-all rounded-lg text-sm font-medium"
          >
            List Vehicle / Gear
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cars')}
            className="px-5 py-2 bg-white text-[#0558FE] border border-white hover:bg-blue-100 transition-all rounded-lg text-sm font-medium"
          >
            Explore Rentals
          </motion.button>
        </div>
      </div>

      {/* Right Image */}
      <motion.img
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        src={assets.banner_car_image}
        alt="Luxury Car"
        className="w-full md:w-1/2 max-w-sm mt-8 md:mt-0 object-contain drop-shadow-xl"
      />
    </motion.div>
  );
};

export default Banner;
