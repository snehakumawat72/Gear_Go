import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-br from-slate-50 to-white text-slate-700 px-6 md:px-16 lg:px-24 xl:px-40 border-t border-slate-200 ${
        isHomePage ? 'py-8' : 'py-16 mt-20'
      }`}
    >
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start gap-12 pb-8 border-b border-slate-200">
        
        {/* Brand Section */}
        <div className="max-w-md">
          <img src={assets.logo} alt="GearGo Logo" className="h-10 mb-4" />
          <p className="text-slate-600 leading-relaxed mb-6">
            Rent or list premium cars along with essential trip gear for all your travel adventures. 
            Experience seamless booking and exceptional service.
          </p>

          {/* Social Media Links */}
          <div className="flex gap-4">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="group p-2 rounded-full bg-slate-100 hover:bg-blue-100 transition-all duration-200"
            >
              <img 
                src={assets.facebook_logo} 
                alt="Facebook" 
                className="w-4 h-4 group-hover:scale-110 transition-transform" 
              />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="group p-2 rounded-full bg-slate-100 hover:bg-pink-100 transition-all duration-200"
            >
              <img 
                src={assets.instagram_logo} 
                alt="Instagram" 
                className="w-4 h-4 group-hover:scale-110 transition-transform" 
              />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="group p-2 rounded-full bg-slate-100 hover:bg-sky-100 transition-all duration-200"
            >
              <img 
                src={assets.twitter_logo} 
                alt="Twitter" 
                className="w-4 h-4 group-hover:scale-110 transition-transform" 
              />
            </a>
            <a 
              href="mailto:info@geargo.com"
              className="group p-2 rounded-full bg-slate-100 hover:bg-red-100 transition-all duration-200"
            >
              <img 
                src={assets.gmail_logo} 
                alt="Gmail" 
                className="w-4 h-4 group-hover:scale-110 transition-transform" 
              />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full lg:w-auto">
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/browse" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link 
                  to="/trip-gears" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Trip Gears
                </Link>
              </li>
              <li>
                <Link 
                  to="/list-your-car" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  List Your Car
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/help" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/insurance" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Insurance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-slate-600 flex items-start">
                <span className="w-4 h-4 mt-0.5 mr-3 opacity-60">📍</span>
                <span>
                  Bhopal, MP<br />
                  India 462001
                </span>
              </li>
              <li>
                <a 
                  href="tel:+919876543210" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  <span className="w-4 h-4 mr-3 opacity-60">📞</span>
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@geargo.com" 
                  className="text-slate-600 hover:text-blue-600 transition-colors duration-200 flex items-center"
                >
                  <span className="w-4 h-4 mr-3 opacity-60">✉️</span>
                  info@geargo.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 text-sm text-slate-600 gap-4">
        <p className="flex items-center">
          <span className="mr-2">©</span>
          {new Date().getFullYear()} GearGo. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <Link 
            to="/privacy" 
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Privacy
          </Link>
          <span className="text-slate-300">•</span>
          <Link 
            to="/terms" 
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Terms
          </Link>
          <span className="text-slate-300">•</span>
          <Link 
            to="/cookies" 
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Cookies
          </Link>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;