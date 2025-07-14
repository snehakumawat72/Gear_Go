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
    setIsLoading(true);

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
      toast.error(error.message);
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
              className='h-14 rounded cursor-pointer'
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
        </div>

        {/* Gear Name & Category */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Gear Name</label>
            <input
              type='text'
              placeholder='e.g. Camping Tent'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={gear.name}
              onChange={(e) => setGear({ ...gear, name: e.target.value })}
            />
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select
              onChange={(e) => setGear({ ...gear, category: e.target.value })}
              value={gear.category}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            >
              <option value=''>Select category</option>
              <option value='Tent'>Tent</option>
              <option value='Sleeping Gear'>Sleeping Gear</option>
              <option value='Camping Kit'>Camping Kit</option>
              <option value='Other'>Other</option>
            </select>
          </div>
        </div>

        {/* Price & Location */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input
              type='number'
              placeholder='e.g. 50'
              required
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
              value={gear.pricePerDay}
              onChange={(e) =>
                setGear({ ...gear, pricePerDay: e.target.value })
              }
            />
          </div>
          <div className='flex flex-col w-full'>
            <label>Location</label>
            <select
              onChange={(e) => setGear({ ...gear, location: e.target.value })}
              value={gear.location}
              className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            >
              <option value=''>Select location</option>
              <option value='Mumbai'>Mumbai</option>
              <option value='Delhi'>Delhi</option>
              <option value='Bangalore'>Bangalore</option>
              <option value='Pune'>Pune</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className='flex flex-col w-full'>
          <label>Description</label>
          <textarea
            rows={5}
            placeholder='e.g. Lightweight and waterproof tent for 4 people. Ideal for weekend trips.'
            required
            className='px-3 py-2 mt-1 border border-borderColor rounded-md outline-none'
            value={gear.description}
            onChange={(e) =>
              setGear({ ...gear, description: e.target.value })
            }
          ></textarea>
        </div>

        {/* ✅ Features Section */}
        <div className='flex flex-col gap-2'>
          <label>Features (max 4)</label>
          <div className='flex gap-2'>
            <input
              type='text'
              placeholder='e.g. Waterproof'
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className='flex-1 px-3 py-2 border border-borderColor rounded-md'
            />
            <button
              type='button'
              onClick={addFeature}
              className='bg-primary text-white px-4 py-2 rounded-md'
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
                  className='text-red-500'
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit Button */}
        <button className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer'>
          <img src={assets.tick_icon} alt='' />
          {isLoading ? 'Listing...' : 'List Your Gear'}
        </button>
      </form>
    </div>
  );
};

export default AddGear;
