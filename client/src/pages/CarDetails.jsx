import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useConfirm } from '../components/ConfirmDialog';

const CarDetails = () => {
  const { id } = useParams()
  const { user, cars, axios, pickupDate, setPickupDate, returnDate, setReturnDate, setShowLogin } = useAppContext()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [paymentOption, setPaymentOption] = useState("")
  const currency = import.meta.env.VITE_CURRENCY
  const confirm = useConfirm();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!pickupDate || !returnDate) {
        toast.error("Please select both pickup and return dates")
        return
      }

      if (!user) {
        toast.error("Please login to book a car")
        setShowLogin(true)
        return
      }

      const { data } = await axios.post('/api/bookings/check-if-available', {
        car: id,
        pickupDate,
        returnDate
      });

      const isCarAvailable = data.isCarAvailable;

      if (isCarAvailable) {
        const confirmed = await confirm("Car is available. Do you want to proceed with booking?");
        if (!confirmed) return;

        const { data } = await axios.post('/api/bookings/create', {
          car: id,
          pickupDate,
          returnDate
        });

        if (data.success) {
          toast.success(data.message);
          if (paymentOption === "Pay Now") {
            toast.success("Online payment successful");
          } else{
            toast.success("You chose to pay at pickup");
          }
          navigate('/my-bookings');
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("This car is not available for the selected dates! Please choose another car or different dates.");
        return;
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setCar(cars.find(car => car._id === id))
  }, [cars, id])

  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-white">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-200 hover:text-white drop-shadow"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-70" />
        Back to all cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20">
          <img
            src={car.image}
            alt=""
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md"
          />
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text drop-shadow">
                {car.brand} {car.model}
              </h1>
              <p className="text-lg text-gray-300">{car.category} • {car.year}</p>
            </div>

            <hr className="border-white/30 my-6" />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location }
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-white/20 backdrop-blur-lg p-4 rounded-lg text-white shadow"
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  {text}
                </div>
              ))}
            </div>

            <div>
              <h2 className="inline-block text-lg font-semibold mb-3 px-3 py-1 rounded border border-white/30 bg-white/10 text-white">
                Description
              </h2>
              <p className="text-gray-100">{car.description}</p>
            </div>

            <div>
              <h2 className="inline-block text-lg font-semibold mb-3 px-3 py-1 rounded border border-white/30 bg-white/10 text-white">
                Features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-100">
                {["360 Camera", "Bluetooth", "GPS", "Heated Seats", "Rear View Mirror"].map(item => (
                  <li key={item} className="flex items-center">
                    <img src={assets.check_icon} alt="" className="h-4 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="shadow-xl h-max sticky top-20 rounded-xl p-6 space-y-6 bg-white/10 backdrop-blur-lg text-white border border-white/20"
        >
          <p className="flex items-center justify-between text-2xl font-semibold">
            {currency} {car.pricePerDay}
            <span className="text-base text-gray-300 font-normal">per day</span>
          </p>

          <hr className="border-white/30 my-6" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date" className="text-white">Pickup Date</label>
            <input
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              className="border border-white/30 px-3 py-2 rounded-lg bg-white text-gray-900"
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date" className="text-white">Return Date</label>
            <input
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              className="border border-white/30 px-3 py-2 rounded-lg bg-white text-gray-900"
              required
              min={pickupDate}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-white font-medium">Payment Option</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentOption"
                  value="Pay Now"
                  checked={paymentOption === "Pay Now"}
                  onChange={(e) => setPaymentOption(e.target.value)}
                  className="accent-primary"
                />
                <span>Pay Now</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentOption"
                  value="Pay Later"
                  checked={paymentOption === "Pay Later"}
                  onChange={(e) => setPaymentOption(e.target.value)}
                  className="accent-primary"
                />
                <span>Pay Later</span>
              </label>
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl">
            Check Availability
          </button>
        </form>
      </div>
    </div>
  ) : (
    <Loader />
  )
}

export default CarDetails
