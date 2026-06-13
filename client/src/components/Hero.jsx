import React, { useState, useEffect } from 'react';
import { assets, cityList } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const bannerImages = [
  assets.ban1,
  assets.ban2,
  assets.ban3,
  assets.ban4,
  assets.ban5,
];

const Hero = () => {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState('');
  const { pickupDate, setPickupDate, returnDate, setReturnDate } = useAppContext();

  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/cars?pickupLocation=${pickupLocation}&pickupDate=${pickupDate}&returnDate=${returnDate}`
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative w-full h-[90vh] flex flex-col items-center text-center overflow-hidden"
      >
        <img
          src={assets.heroBackground} 
          alt="Hero Background"
          className="absolute  inset:0 w-full h-full object-cover z-0"
        />

        
        <div className="relative z-20 px-4 py-5 w-full max-w-screen-xl  mt-0">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-semibold text-[#F5F5F5] mt-0 mb-0"
          >
            Luxury cars on Rent
          </motion.h1>
          
          {/* Search Form */}
          <motion.form
            initial={{ scale: 0.95, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-200 mx-auto bg-none text-[#F5F5F5] shadow-[0_8px_20px_rgba(0,0,0,0.3)]"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-10 w-full">

              {/* Pickup Location */}
              <div className="flex flex-col items-start gap-2 w-full md:w-auto">
                <p className="px-1 text-sm text-gray-400">
                  Select your location
                </p>
                <select
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="bg-[#111] text-[#F5F5F5] border border-[#333] px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-[#D4AF37] bg-white text-black"
                >
                  <option value="">Pickup Location</option>
                  {cityList.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                
              </div>

              {/* Pickup Date */}
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="pickup-date" className="text-sm">Pick-up Date</label>
                <input
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  type="date"
                  id="pickup-date"
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="bg-[#111] text-[#F5F5F5] border border-[#333] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] bg-white text-black"
                />
              </div>

              {/* Return Date */}
              <div className="flex flex-col items-start gap-2">
                <label htmlFor="return-date" className="text-sm">Return Date</label>
                <input
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  type="date"
                  id="return-date"
                  required
                  min={pickupDate}
                  className="bg-[#111] text-[#F5F5F5] border border-[#333] px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] bg-white text-black"
                />
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-9 py-3 max-sm:mt-4 bg-[#D4AF37] hover:bg-[#C9A033] text-black rounded-full font-medium transition-all"
              >
                Search
                <img src={assets.search_icon} alt="search" className="brightness-0 invert" />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>

      
    </>
  );
};

export default Hero;
