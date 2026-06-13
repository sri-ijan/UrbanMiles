import React, { useState, useEffect } from 'react';
import Title from './Title';
import { assets } from '../assets/assets';
import CarCard from './CarCard';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';

const bannerImages = [
  assets.ban1,
  assets.ban2,
  assets.ban3,
  assets.ban4,
  assets.ban5,
];

const FeaturedSection = () => {
  const navigate = useNavigate();
  const { cars } = useAppContext();
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      className="flex flex-col items-center py-24 px-6 md:px-16 lg:px-24 xl:px-32"
    >

      <div className="relative w-full max-w-[1440px] aspect-[3.5/1] overflow-hidden rounded-xl mb-16 shadow-md">
        {bannerImages.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`banner-${index}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        <button
          onClick={() =>
            setCurrentBanner((currentBanner - 1 + bannerImages.length) % bannerImages.length)
          }
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white text-2xl px-3 py-1 rounded-full z-20"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentBanner((currentBanner + 1) % bannerImages.length)}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-40 text-white text-2xl px-3 py-1 rounded-full z-20"
        >
          ›
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentBanner === index ? 'bg-white' : 'bg-white/50'
              }`}
            ></button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Title
          title="Featured Vehicles"
          subTitle="Explore our selection of premium vehicles available for your next adventure."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18"
      >
        {cars.slice(0, 6).map((car) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            key={car._id}
          >
            <CarCard car={car} />
          </motion.div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        onClick={() => {
          navigate('/cars');
          scrollTo(0, 0);
        }}
        className="flex items-center justify-center gap-2 px-6 py-2 border border-borderColor hover:bg-gray-50 rounded-md mt-18 cursor-pointer"
      >
        Explore all cars <img src={assets.arrow_icon} alt="arrow" />
      </motion.button>
    </motion.div>
  );
};

export default FeaturedSection;
