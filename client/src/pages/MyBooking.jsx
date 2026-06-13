import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Title from '../components/Title';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { useConfirm } from '../components/ConfirmDialog';



const MyBooking = () => {
  const { axios, user, currency } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const confirm = useConfirm();
  
  const fetchMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/user');
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    user && fetchMyBookings();
  }, [user]);


  const handleCancellation = async (bookingId, status) => {
    
    try{ 
      if (status === 'cancelled') {
        toast.error("This booking is already cancelled.");
        return;
      }
      console.log("here: ", status);
      
      const confirmed = await confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
      console.log("confirmed: ", confirmed);
      
      if (confirmed) {
        const { data } = await axios.post('/api/bookings/cancel', { bookingId });
        if (data.success) {
          toast.success("Cancellation request sent successfully");
          fetchMyBookings(); 
        } else {
          toast.error(data.message);
        }
      } 
    }catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[90vh] px-4 py-10">
      <div className="w-full max-w-6xl p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-md border border-white/20">
        <Title
          title="My Bookings"
          subTitle="View and manage all your car bookings"
          align="left"
        />

        <div className="mt-8">
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-white/5 border border-white/20 rounded-xl mb-6"
            >
              {/* Car Info */}
              <div className="md:col-span-1">
                <div className="rounded-lg overflow-hidden mb-3 shadow">
                  <img
                    src={booking.car.image}
                    alt=""
                    className="w-full h-auto aspect-video object-cover"
                  />
                </div>
                <p className="text-lg font-semibold text-white">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-white/80 text-sm">
                  {booking.car.year} • {booking.car.category} • {booking.car.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="px-3 py-1.5 bg-yellow-400/20 text-yellow-300 rounded-full text-sm">
                    Booking #{index + 1}
                  </p>
                  <div>
                    <p
                      className={`px-3 py-1.5 text-xs rounded-full ${
                        booking.status === 'confirmed'
                          ? 'bg-green-500/10 text-green-400'
                          : booking.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-300'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                      
                    >
                      {booking.status}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-4">
                  <img
                    src={assets.calendar_icon_colored}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-white/80 text-sm">Rental Period</p>
                    <p className="text-white text-sm">
                      {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 mt-4">
                  <img
                    src={assets.location_icon}
                    alt=""
                    className="w-4 h-4 mt-1"
                  />
                  <div>
                    <p className="text-white/80 text-sm">Pick-up Location</p>
                    <p className="text-white text-sm">{booking.car.location}</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 flex flex-col justify-between gap-6 text-right">
                <div className="text-sm text-white/80">
                  <p>Total Price</p>
                  <h1 className="text-2xl font-bold text-yellow-400">
                    {currency} {booking.price}
                  </h1>
                  <p>Booked on {booking.createdAt.split('T')[0]}</p>
                </div>

                <div className="flex justify-end pr-2">
                  {new Date(booking.returnDate) < new Date() ? (
                    <button
                      className="px-4 py-2 bg-gray-400 text-white text-sm rounded-full whitespace-nowrap cursor-not-allowed"
                      disabled
                    >
                      Request Cancellation
                    </button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 cursor-pointer text-sm rounded-full whitespace-nowrap"
                      onClick={() => handleCancellation(booking._id, booking.status)}
                    >
                      Request Cancellation
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {bookings.length === 0 && (
            <p className="text-white/80 text-center mt-10">
              You haven't made any bookings yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBooking;
