import React, { useState } from 'react'
import Title from '../../components/owner/Title'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const AddCar = () => {

  const {axios, currency} = useAppContext()

  const [image, setImage] = useState(null)
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {};
    
    if (!image) {
      newErrors.image = "Car image is required";
    }
    
    if (!car.brand.trim()) {
      newErrors.brand = "Brand is required";
    }
    
    if (!car.model.trim()) {
      newErrors.model = "Model is required";
    }
    
    if (!car.year || car.year < 1900 || car.year > new Date().getFullYear() + 1) {
      newErrors.year = "Please enter a valid year";
    }
    
    if (!car.pricePerDay || car.pricePerDay <= 0) {
      newErrors.pricePerDay = "Price per day must be greater than 0";
    }
    
    if (!car.category) {
      newErrors.category = "Category is required";
    }
    
    if (!car.transmission) {
      newErrors.transmission = "Transmission type is required";
    }
    
    if (!car.fuel_type) {
      newErrors.fuel_type = "Fuel type is required";
    }
    
    if (!car.seating_capacity || car.seating_capacity <= 0) {
      newErrors.seating_capacity = "Seating capacity must be greater than 0";
    }
    
    if (!car.location) {
      newErrors.location = "Location is required";
    }
    
    if (!car.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e)=>{
    e.preventDefault()
    if(isLoading) return null

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    setIsLoading(true)
    setErrors({})
    
    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('carData', JSON.stringify(car))

      const {data} = await axios.post('/api/owner/add-car', formData)

      if(data.success){
        toast.success(data.message)
        setImage(null)
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        })
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Add car error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to add car');
    }finally{
      setIsLoading(false)
    }
  }

  return (
    <div className='px-4 py-10 md:px-10 flex-1'>

      <Title title="Add New Car" subTitle="Fill in details to list a new car for booking, including pricing, availability, and car specifications."/>

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>

        {/* Car Image */}
        <div className='flex items-center gap-2 w-full'>
          <label htmlFor="car-image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" className={`h-14 rounded cursor-pointer ${errors.image ? 'border-2 border-red-500' : ''}`}/>
            <input type="file" id="car-image" accept="image/*" hidden onChange={e=> setImage(e.target.files[0])}/>
          </label>
          <p className='text-sm text-gray-500'>Upload a picture of your car</p>
          {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
        </div>

        {/* Car Brand & Model */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Brand</label>
            <input 
              type="text" 
              placeholder="e.g. BMW, Mercedes, Audi..." 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.brand ? 'border-red-500' : 'border-borderColor'}`} 
              value={car.brand} 
              onChange={e=> setCar({...car, brand: e.target.value})}
            />
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Model</label>
            <input 
              type="text" 
              placeholder="e.g. X5, E-Class, M4..." 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.model ? 'border-red-500' : 'border-borderColor'}`} 
              value={car.model} 
              onChange={e=> setCar({...car, model: e.target.value})}
            />
            {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
          </div>
        </div>

        {/* Car Year, Price, Category */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Year</label>
            <input 
              type="number" 
              placeholder="2025" 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.year ? 'border-red-500' : 'border-borderColor'}`} 
              value={car.year} 
              onChange={e=> setCar({...car, year: e.target.value})}
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Daily Price ({currency})</label>
            <input 
              type="number" 
              placeholder="100" 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.pricePerDay ? 'border-red-500' : 'border-borderColor'}`} 
              value={car.pricePerDay} 
              onChange={e=> setCar({...car, pricePerDay: e.target.value})}
            />
            {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Category</label>
            <select 
              onChange={e=> setCar({...car, category: e.target.value})} 
              value={car.category} 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.category ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Van">Van</option>
              <option value="Hatchback">Hatchback</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

         {/* Car Transmission, Fuel Type, Seating Capacity */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
          <div className='flex flex-col w-full'>
            <label>Transmission</label>
            <select 
              onChange={e=> setCar({...car, transmission: e.target.value})} 
              value={car.transmission} 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.transmission ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
            </select>
            {errors.transmission && <p className="text-red-500 text-xs mt-1">{errors.transmission}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Fuel Type</label>
            <select 
              onChange={e=> setCar({...car, fuel_type: e.target.value})} 
              value={car.fuel_type} 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.fuel_type ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value="">Select a fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
              <option value="CNG">CNG</option>
            </select>
            {errors.fuel_type && <p className="text-red-500 text-xs mt-1">{errors.fuel_type}</p>}
          </div>
          <div className='flex flex-col w-full'>
            <label>Seating Capacity</label>
            <input 
              type="number" 
              placeholder="4" 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.seating_capacity ? 'border-red-500' : 'border-borderColor'}`} 
              value={car.seating_capacity} 
              onChange={e=> setCar({...car, seating_capacity: e.target.value})}
            />
            {errors.seating_capacity && <p className="text-red-500 text-xs mt-1">{errors.seating_capacity}</p>}
          </div>
        </div>

         {/* Car Location */}
         <div className='flex flex-col w-full'>
            <label>Location</label>
            <select 
              onChange={e=> setCar({...car, location: e.target.value})} 
              value={car.location} 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.location ? 'border-red-500' : 'border-borderColor'}`}
            >
              <option value="">Select a location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Chennai">Chennai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Pune">Pune</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Ahmedabad">Ahmedabad</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Indore">Indore</option>
              <option value="Goa">Goa</option>
            </select>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
         </div>
        {/* Car Description */}
         <div className='flex flex-col w-full'>
            <label>Description</label>
            <textarea 
              rows={5} 
              placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine." 
              className={`px-3 py-2 mt-1 border rounded-md outline-none ${errors.description ? 'border-red-500' : 'border-borderColor'}`} 
              value={car.description} 
              onChange={e=> setCar({...car, description: e.target.value})}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

        <button 
          disabled={isLoading}
          className='flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary text-white rounded-md font-medium w-max cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>


      </form>

    </div>
  )
}

export default AddCar
