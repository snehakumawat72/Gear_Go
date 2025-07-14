import React from 'react';
import Title from './Title';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Testimonial = () => {
  const testimonials = [
    {
      name: 'Aarav Mehta',
      location: 'Mumbai, India',
      image: assets.testimonial_image_1,
      testimonial: "Rented a BMW X5 for a weekend trip — seamless process and the car was pristine! Definitely my go-to platform now."
    },
    {
      name: 'Lily Chen',
      location: 'San Francisco, USA',
      image: assets.testimonial_image_2,
      testimonial: "Booked a camping gear kit for Yosemite. Everything was clean, compact, and super easy to return. Loved the service!"
    },
    {
      name: 'Lucas Fernandes',
      location: 'Lisbon, Portugal',
      image: assets.testimonial_image_1,
      testimonial: "Listed my car last month and already got 3 bookings! The platform makes earning extra income incredibly simple."
    }
  ];

  return (
    <div className="bg-[#F9FBFE] py-24 px-6 md:px-16 lg:px-24 xl:px-40">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1F2937]">What Our Customers Say</h2>
        <p className="text-[#475569] mt-2 text-base md:text-lg">
          Hear from travelers and owners who trust us for smooth trips and extra income.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white p-6 rounded-3xl shadow-md hover:shadow-lg transition-all duration-500 border border-[#E5EAF0]"
          >
            <div className="flex items-center gap-3">
              <img className="w-12 h-12 rounded-full border border-blue-100" src={testimonial.image} alt={testimonial.name} />
              <div>
                <p className="text-base font-semibold text-[#1F2937]">{testimonial.name}</p>
                <p className="text-sm text-[#64748B]">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mt-4">
              {Array(5).fill(0).map((_, idx) => (
                <img key={idx} src={assets.star_icon} alt="star-icon" className="w-5 h-5" />
              ))}
            </div>

            <p className="text-[#475569] mt-4 text-sm leading-relaxed italic">
              "{testimonial.testimonial}"
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Testimonial;
