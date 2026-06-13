import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast'  
const Banner = () => {
const navigate = useNavigate();
const {user, setShowLogin} = useAppContext();
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-12 rounded-2xl overflow-hidden bg-gradient-to-r from-[#1B1B1B] to-[#2E2E2E] shadow-md max-w-6xl mx-3 md:mx-auto mt-12">
      {/* Text Section */}
      <div className="text-white max-w-xl">
        <h2 className="text-3xl md:text-4xl font-semibold leading-tight">
          Do You Own a Luxury Car?
        </h2>
        <p className="mt-3 text-[#DDDDDD]">
          Monetize your vehicle effortlessly by listing it on <span className="text-[#D4AF37]">UrbanMiles</span>.
        </p>
        <p className="mt-2 text-[#CCCCCC] text-sm">
          We handle insurance, driver verification, and secure payments — so you earn passive income, stress-free.
        </p>

        <button
          onClick={user ? () => navigate('/owner/add-car') : () => {setShowLogin(true); toast.error("Please login to list your car")}}
          className="mt-6 px-6 py-2 text-sm font-medium bg-[#D4AF37] text-black hover:bg-[#C9A033] rounded-lg transition-all"
        >
          List your car
        </button>
      </div>

      {/* Car Image */}
      <img
        src={assets.banner_car_image}
        alt="Luxury car"
        className="max-h-56 md:max-h-60 mt-10 md:mt-0 md:ml-8"
      />
    </div>
  );
};

export default Banner;
