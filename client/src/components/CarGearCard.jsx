import React from 'react';
import { useNavigate } from 'react-router-dom';

const CarGearCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-md p-4 max-w-xs hover:shadow-xl transition">
      <img src={movie.image} alt={movie.name} className="w-full h-40 object-cover rounded-md mb-3" />
      <h3 className="font-semibold text-lg text-gray-800">{movie.name}</h3>
      <p className="text-gray-600 text-sm">{movie.location} — ₹{movie.rent}/day</p>
      <button
        onClick={() => navigate(`/product/${movie._id}`)}
        className="mt-3 bg-orange-500 hover:bg-orange-600 text-white py-1.5 px-4 text-sm rounded"
      >
        {movie.category === 'gear' ? 'Explore Gear' : 'Rent Now'}
      </button>
    </div>
  );
};

export default CarGearCard;
