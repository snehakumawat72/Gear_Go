// src/pages/owner/AddGear.jsx
import React, { useState } from 'react';
import Title from '../../components/owner/Title';
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddGear = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [gear, setGear] = useState({
    name: '',
    category: '',
    pricePerDay: 0,
    location: '',
    description: '',
    features: [], // ✅ Add features here
  });

  const [featureInput, setFeatureInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!image) {
      newErrors.image = "Gear image is required";
    }
    
    if (!gear.name.trim()) {
      newErrors.name = "Gear name is required";
    }
    
    if (!gear.category) {
      newErrors.category = "Category is required";
    }
    
    if (!gear.pricePerDay || gear.pricePerDay <= 0) {
      newErrors.pricePerDay = "Price per day must be greater than 0";
    }
    
    if (!gear.location) {
      newErrors.location = "Location is required";
    }
    
    if (!gear.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const addFeature = () => {
    if (featureInput && gear.features.length < 4) {
      setGear({ ...gear, features: [...gear.features, featureInput] });
      setFeatureInput('');
    } else if (gear.features.length >= 4) {
      toast.error("You can add up to 4 features only.");
    }
  };

  const removeFeature = (index) => {
    const updated = [...gear.features];
    updated.splice(index, 1);
    setGear({ ...gear, features: updated });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return null;
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('gearData', JSON.stringify(gear));

      const { data } = await axios.post('/api/owner/add-gear', formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setGear({
          name: '',
          category: '',
          pricePerDay: 0,
          location: '',
          description: '',
          features: []
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Add gear error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add gear');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>
      <Title
        title='Add New Gear'
        subTitle='Fill in details to list a new gear item for booking including name, category, pricing, and more.'
      />

      <form
        onSubmit={onSubmitHandler}
        className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'
      >
        {/* Gear Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor='gear-image'>
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              alt=''
              className={`h-14 rounded cursor-pointer ${errors.image ? 'border-2 border-red-500' : ''}`}
            />
            <input
              type='file'
              id='gear-image'
              accept='image/*'
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your gear</p>
          {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
        </div>

        {/* Gear Name & Category */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Gear Name</label>
            <input
              type='text'
              placeholder='e.g. Camping Tent'
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.name ? 'border-red-500' : 'border-borderColor'}`}
              value={gear.name}
              onChange={(e) => setGear({ ...gear, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select
              onChange={(e) => setGear({ ...gear, category: e.target.value })}
              value={gear.category}
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.category ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value=''>Select category</option>
              <option value='Tent'>Tent</option>
              <option value='Sleeping Gear'>Sleeping Gear</option>
              <option value='Camping Kit'>Camping Kit</option>
              <option value='Backpack'>Backpack</option>
              <option value='Cooking Gear'>Cooking Gear</option>
              <option value='Navigation'>Navigation</option>
              <option value='Other'>Other</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Price & Location */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input
              type='number'
              placeholder='e.g. 50'
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.pricePerDay ? 'border-red-500' : 'border-borderColor'}`}
              value={gear.pricePerDay}
              onChange={(e) =>
                setGear({ ...gear, pricePerDay: e.target.value })
              }
            />
            {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Location</label>
            <select
              onChange={(e) => setGear({ ...gear, location: e.target.value })}
              value={gear.location}
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.location ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value=''>Select location</option>
              <option value='Delhi'>Delhi</option>
              <option value='Mumbai'>Mumbai</option>
              <option value='Bangalore'>Bangalore</option>
              <option value='Chennai'>Chennai</option>
              <option value='Hyderabad'>Hyderabad</option>
              <option value='Pune'>Pune</option>
              <option value='Kolkata'>Kolkata</option>
              <option value='Ahmedabad'>Ahmedabad</option>
              <option value='Jaipur'>Jaipur</option>
              <option value='Indore'>Indore</option>
              <option value='Goa'>Goa</option>
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
          </div>
        </div>

        {/* Description */}
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea
            rows={5}
            placeholder='e.g. Lightweight and waterproof tent for 4 people. Ideal for weekend trips.'
            className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.description ? 'border-red-500' : 'border-borderColor'}`}
            value={gear.description}
            onChange={(e) =>
              setGear({ ...gear, description: e.target.value })
            }
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Features Section */}
        <div className='flex flex-col gap-2'>
          <label>Features (max 4)</label>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='e.g. Waterproof'
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className='flex-1 px-3 py-2 border border-borderColor rounded-md'
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <button
              type='button'
              onClick={addFeature}
              className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dull transition-colors'
            >
              Add
            </button>
          </div>

          {/* Show added features */}
          <ul className='flex flex-wrap gap-2 mt-2'>
            {gear.features.map((f, idx) => (
              <li
                key={idx}
                className='bg-light px-3 py-1 rounded-full flex items-center gap-2'
              >
                {f}
                <button
                  type='button'
                  onClick={() => removeFeature(idx)}
                  className='text-red-500 hover:text-red-700 font-bold'
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button 
          disabled={isLoading}
          className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <img src={assets.tick_icon} alt='' />
          {isLoading ? 'Listing...' : 'List Your Gear'}
        </button>
      </form>
    </div>
  );
};

export default AddGear;
