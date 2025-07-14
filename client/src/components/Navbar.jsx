import React, { useEffect, useState } from 'react';
import { assets, menuLinks } from '../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const changeRole = async () => {
    try {
      const { data } = await axios.post('/api/owner/change-role');
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isTransparent = location.pathname === '/' && !scrolled;

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-white/5 backdrop-blur-md text-white'
          : 'bg-white text-gray-600 shadow-sm border-b border-borderColor'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 relative">

        {/* Logo */}
        <Link to="/">
          <motion.img whileHover={{ scale: 1.05 }} src={assets.logo} alt="logo" className="h-8" />
        </Link>

        {/* Navigation Links */}
       <div
  className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50 ${
    open ? 'max-sm:translate-x-0' : 'max-sm:translate-x-full'
  }`}
>

         {menuLinks.map((link, index) => (
  <Link key={index} to={link.path} onClick={() => setOpen(false)}>
    {link.name}
  </Link>
))}


          {/* Search bar */}
         <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 max-w-56 w-full rounded-full border border-borderColor 
  ${isTransparent ? 'bg-white/10 backdrop-blur-md text-white placeholder-white' : 'bg-white text-gray-800 placeholder-gray-500'}`}>

  <input
    type="text"
    className={`w-full bg-transparent outline-none text-sm 
    ${isTransparent ? 'text-white placeholder-white' : 'text-gray-800 placeholder-gray-500'}`}
    placeholder="Search "
  />
  <img 
    src={assets.search_icon} 
    alt="search" 
    className={`${isTransparent ? 'invert opacity-90' : 'opacity-70'}`} 
  />
</div>



          {/* Action buttons */}
          <div className="flex max-sm:flex-col items-start sm:items-center gap-6">
            <button
              onClick={() => (isOwner ? navigate('/owner') : changeRole())}
              className="cursor-pointer"
            >
              {isOwner ? 'Dashboard' : 'List cars'}
            </button>

            <button
              onClick={() => {
                user ? logout() : setShowLogin(true);
              }}
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
            >
              {user ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>

        {/* Mobile menu icon */}
        <button className="sm:hidden cursor-pointer" aria-label="Menu" onClick={() => setOpen(!open)}>
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />
        </button>
      </div>
    </motion.div>
  );
};

export default Navbar;
