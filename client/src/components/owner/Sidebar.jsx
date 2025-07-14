import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, axios, fetchUser } = useAppContext();
  const location = useLocation();
  const [image, setImage] = useState('');

  const updateImage = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/owner/update-image', formData);

      if (data.success) {
        fetchUser();
        toast.success(data.message);
        setImage('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Sidebar links (you can split them in groups if needed)
  const links = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon, coloredIcon: assets.dashboardIconColored },
    { name: "Add car", path: "/owner/add-car", icon: assets.addIcon, coloredIcon: assets.addIconColored },
    { name: "Add Gear", path: "/owner/add-gear", icon: assets.insert, coloredIcon: assets.insert },
    { name: "Manage Cars", path: "/owner/manage-cars", icon: assets.carIcon, coloredIcon: assets.carIconColored },
    { name: "Manage Bookings", path: "/owner/manage-bookings", icon: assets.listIcon, coloredIcon: assets.listIconColored },
    { name: "Manage Gears", path: "/owner/manage-gears", icon: assets.gear_icon, coloredIcon: assets.gear_icon },
  ];

  return (
    <div className='relative min-h-screen md:flex flex-col items-center pt-8 max-w-13 md:max-w-60 w-full border-r border-borderColor text-sm'>

      {/* Profile Image */}
      <div className='group relative'>
        <label htmlFor="image">
          <img
            src={image ? URL.createObjectURL(image) : user?.image || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300"}
            alt="Profile"
            className='h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto object-cover'
          />
          <input type="file" id='image' accept="image/*" hidden onChange={e => setImage(e.target.files[0])} />

          <div className='absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full group-hover:flex items-center justify-center cursor-pointer'>
            <img src={assets.edit_icon} alt="edit" />
          </div>
        </label>
      </div>

      {/* Save Button */}
      {image && (
        <button className='absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer' onClick={updateImage}>
          Save <img src={assets.check_icon} width={13} alt="check" />
        </button>
      )}

      {/* Name */}
      <p className='mt-2 text-base capitalize max-md:hidden'>{user?.name || "Owner"}</p>

      {/* Sidebar Links */}
      <div className='w-full'>
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${link.path === location.pathname ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600'}`}
          >
            <img
              src={link.path === location.pathname ? link.coloredIcon : link.icon}
              alt="icon"
              className="w-5 h-5"
            />
            <span className='max-md:hidden'>{link.name}</span>
            {link.path === location.pathname && (
              <div className='bg-primary w-1.5 h-8 rounded-l right-0 absolute'></div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar;
