import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';

const ManageGear = () => {
  const { isOwner, axios, currency } = useAppContext();

  const [gears, setGears] = useState([]);

  const fetchOwnerGears = async () => {
    try {
      const { data } = await axios.get('/api/owner/gears');
      if (data.success) {
        setGears(data.gears);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (gearId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-gear', { gearId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerGears();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteGear = async (gearId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this gear?');
      if (!confirm) return;
      const { data } = await axios.post('/api/owner/delete-gear', { gearId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerGears();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerGears();
  }, [isOwner]);

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title title="Manage Trip Gear" subTitle="View all listed gears, update their details, or remove them from the booking platform." />

      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className="p-3 font-medium">Gear</th>
              <th className="p-3 font-medium max-md:hidden">Category</th>
              <th className="p-3 font-medium">Price</th>
              <th className="p-3 font-medium max-md:hidden">Status</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {gears.map((gear, index) => (
              <tr key={index} className='border-t border-borderColor'>
                <td className='p-3 flex items-center gap-3'>
                  <img src={gear.image} alt={gear.name} className="h-12 w-12 aspect-square rounded-md object-cover" />
                  <div className='max-md:hidden'>
                    <p className='font-medium'>{gear.name}</p>
                    <p className='text-xs text-gray-500'>{gear.location}</p>
                  </div>
                </td>
                <td className='p-3 max-md:hidden'>{gear.category}</td>
                <td className='p-3'>{currency}{gear.pricePerDay}/day</td>
                <td className='p-3 max-md:hidden'>
                  <span className={`px-3 py-1 rounded-full text-xs ${gear.isAvaliable ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                    {gear.isAvaliable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className='flex items-center p-3'>
                  <img onClick={() => toggleAvailability(gear._id)} src={gear.isAvaliable ? assets.eye_close_icon : assets.eye_icon} alt="toggle-icon" className='cursor-pointer' />
                  <img onClick={() => deleteGear(gear._id)} src={assets.delete_icon} alt="delete-icon" className='cursor-pointer' />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageGear;
