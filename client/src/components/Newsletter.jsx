import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.3 }}
      className="bg-[#F9FBFE] text-center px-6 py-16"
    >
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold text-[#1F2937] mb-4"
        >
          Never Miss a Deal
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-[#475569] text-base md:text-lg mb-8"
        >
          Get exclusive offers, new arrivals & discounts straight to your inbox.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 text-[#1E293B] bg-white border border-[#D7E9FF] rounded-md outline-none focus:ring-2 focus:ring-blue-100 transition"
                required
              />
              <button
                type="submit"
                className="h-12 px-6 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-medium rounded-md transition"
              >
                Subscribe
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 text-green-700 p-4 rounded-md border border-green-200"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">✓</span>
                <span className="font-medium">Successfully Subscribed</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Newsletter;
