import React from 'react';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const GearCard = ({ gear }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate(`/gear-details/${gear._id}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="bg-white group rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer"
    >
      {/* Image section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={gear.image}
          alt="Gear Image"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {gear.isAvailable && (
          <p className="absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full">
            Available Now
          </p>
        )}

        <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <span className="font-semibold">
            {currency}
            {gear.pricePerDay}
          </span>
          <span className="text-sm text-white/80"> / day</span>
        </div>
      </div>

      {/* Text info */}
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-medium">{gear.name}</h3>
            <p className="text-muted-foreground text-sm">{gear.category}</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600 text-sm text-muted-foreground">
          <div className="flex items-center">
            <img src={assets.location_icon} alt="location" className="h-4 mr-2" />
            <span>{gear.location}</span>
          </div>

          <div className="flex items-center">
            <img src={assets.users_icon} alt="qty" className="h-4 mr-2" />
            <span>{gear.quantity || '1'} Available</span>
          </div>

          {/* Show up to 2 features here if available */}
          {gear.features?.[0] && (
            <div className="flex items-center">
              <img src={assets.check_icon} alt="feature" className="h-4 mr-2" />
              <span>{gear.features[0]}</span>
            </div>
          )}

          {gear.features?.[1] && (
            <div className="flex items-center">
              <img src={assets.check_icon} alt="feature" className="h-4 mr-2" />
              <span>{gear.features[1]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GearCard;

