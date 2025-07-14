import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const serviceData = [
  {
    title: 'Rent a Car',
    description: 'Choose from our wide range of premium vehicles for your journey.',
    icon: assets.transport,
    link: '/cars',
  },
  {
    title: 'List Your Car',
    description: 'Earn by listing your vehicle for others to rent easily.',
    icon: assets.insert,
    link: '/owner/add-car',
  },
  {
    title: 'Trip Gears',
    description: 'Get all essential travel gear for your outdoor adventures.',
    icon: assets.backpack,
    link: '/trip-gears',
  },
  {
    title: 'List Your Gear',
    description: 'Make extra income by listing your camping or travel gear.',
    icon: assets.gear_icon,
    link: '/owner/add-gear',
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 md:px-16 lg:px-24 xl:px-32 bg-[#F7FAFF]">
      <div className="max-w-7xl mx-auto text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Explore Our Services</h2>
        <p className="text-gray-500 mt-3 text-base md:text-lg">
          Everything you need for the road — in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {serviceData.map((service, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-3xl border border-blue-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
          >
            <div className="bg-[#FFEFD6] w-14 h-14 flex items-center justify-center rounded-xl mb-5">
              <img src={service.icon} alt={service.title} className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
            <p className="text-sm text-gray-600 mb-5">{service.description}</p>
            <button
              onClick={() => navigate(service.link)}
              className="text-sm font-medium text-white bg-[#2563EB] hover:bg-[#1E4ED8] px-5 py-2 rounded-md transition"
            >
              Explore →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
