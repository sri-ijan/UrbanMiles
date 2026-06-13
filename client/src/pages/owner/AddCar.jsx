import React, { useState } from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const AddCar = () => {
  const { axios, currency } = useAppContext();

  const [image, setImage] = useState(null);
  const [car, setCar] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify(car));

      const { data } = await axios.post('/api/owner/add-car', formData);

      if (data.success) {
        toast.success(data.message);
        
        setImage(null);
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
    <div className="px-4 py-10 md:px-10 flex-1 flex justify-center">
      <div className="w-full max-w-4xl p-6 md:p-10 rounded-2xl shadow-xl 
                      bg-gradient-to-br from-white/10 via-white/5 to-transparent 
                      backdrop-blur-xl border border-white/20">

        <h1 className="text-3xl font-semibold text-[#D4AF37]">Add new car</h1>
        <p className="text-base text-white">
          Fill in details to list a new car for booking, including pricing, availability, and car specifications.
        </p>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5 text-gray-200 text-sm mt-6">
          {/* Upload */}
          <div className="flex items-center gap-2 w-full">
            <label htmlFor="car-image">
              <img
                src={image ? URL.createObjectURL(image) : assets.upload_icon}
                alt=""
                className="h-14 rounded cursor-pointer"
              />
              <input
                type="file"
                id="car-image"
                accept="image/*"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            <p className="text-sm text-white">Upload a picture of your car</p>
          </div>

          {/* Brand & Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col w-full">
              <label className="text-white text-sm font-medium opacity-80">Brand</label>
              <input
                type="text"
                placeholder="e.g. BMW, Mercedes .."
                required
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black font-semibold outline-none"
                value={car.brand}
                onChange={(e) => setCar({ ...car, brand: e.target.value })}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-white text-sm font-medium opacity-80">Model</label>
              <input
                type="text"
                placeholder="e.g. X5 , E-Class, M4 .."
                required
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black font-semibold outline-none"
                value={car.model}
                onChange={(e) => setCar({ ...car, model: e.target.value })}
              />
            </div>
          </div>

          {/* Year / Price / Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="text-white text-sm font-medium opacity-80">Year</label>
              <input
                type="number"
                placeholder="2025"
                required
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black font-semibold outline-none"
                value={car.year}
                onChange={(e) => setCar({ ...car, year: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-medium opacity-80">
                Daily Price ({currency})
              </label>
              <input
                type="number"
                placeholder="100"
                required
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black font-semibold outline-none"
                value={car.pricePerDay}
                onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-medium opacity-80">Category</label>
              <select
                value={car.category}
                onChange={(e) => setCar({ ...car, category: e.target.value })}
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black outline-none"
              >
                <option value="">Select a category</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Van">Van</option>
              </select>
            </div>
          </div>

          {/* Transmission / Fuel / Seats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <label className="text-white text-sm font-medium opacity-80">Transmission</label>
              <select
                value={car.transmission}
                onChange={(e) => setCar({ ...car, transmission: e.target.value })}
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black outline-none"
              >
                <option value="">Select a transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="Semi-Automatic">Semi-Automatic</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-medium opacity-80">Fuel Type</label>
              <select
                value={car.fuel_type}
                onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black outline-none"
              >
                <option value="">Select a fuel type</option>
                <option value="Gas">Gas</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-white text-sm font-medium opacity-80">Seating Capacity</label>
              <input
                type="number"
                placeholder="4"
                required
                className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black font-semibold outline-none"
                value={car.seating_capacity}
                onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-white text-sm font-medium opacity-80">Location</label>
            <select
              value={car.location}
              onChange={(e) => setCar({ ...car, location: e.target.value })}
              className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black outline-none"
            >
              <option value="">Select a Location</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Panjab">Panjab</option>
              <option value="Hydrabad">Hydrabad</option>
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-white text-sm font-medium opacity-80">Description</label>
            <textarea
              rows={5}
              placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine"
              required
              className="px-3 py-2 mt-1 rounded-md bg-white/90 text-black font-semibold outline-none"
              value={car.description}
              onChange={(e) => setCar({ ...car, description: e.target.value })}
            ></textarea>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 mt-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md font-semibold w-max transition"
          >
            <img src={assets.tick_icon} alt="" className="w-4 h-4" />
            {isLoading ? 'Listing...' : 'List Your Car'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCar;
