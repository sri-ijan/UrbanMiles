import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {
  const { currency, axios } = useAppContext()
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className="w-full px-4 pt-10 md:px-10">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-[#D4AF37]">Manage Bookings</h1>
        <p className="text-base text-white mb-4">
          Track all customer bookings, approve or cancel requests, and manage booking statuses.
        </p>

        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-left text-sm text-white">
            <thead className="bg-white/20 text-white uppercase text-xs font-semibold">
              <tr>
                <th className="p-3">Car</th>
                <th className="p-3 max-md:hidden">Date Range</th>
                <th className="p-3">Total</th>
                <th className="p-3 max-md:hidden">Payment</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr
                  key={index}
                  className="border-t border-white/20 hover:bg-white/10 transition-all"
                >
                  <td className="p-3 flex items-center gap-3">
                    <img
                      src={booking.car.image}
                      alt=""
                      className="h-12 w-12 aspect-square rounded-md object-cover"
                    />
                    <p className="font-medium max-md:hidden">
                      {booking.car.brand} {booking.car.model}
                    </p>
                  </td>

                  <td className="p-3 max-md:hidden">
                    {booking.pickupDate.split('T')[0]} to{' '}
                    {booking.returnDate.split('T')[0]}
                  </td>

                  <td className="p-3">
                    {currency} {booking.price}
                  </td>

                  <td className="p-3 max-md:hidden">
                    <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-medium">
                      Offline
                    </span>
                  </td>

                  <td className="p-3">
                    {booking.status === 'pending' ? (
                      <select
                        onChange={(e) =>
                          changeBookingStatus(booking._id, e.target.value)
                        }
                        value={booking.status}
                        className="px-3 py-1.5 bg-white text-sm text-gray-700 rounded-md shadow-sm focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-200 text-green-700'
                            : 'bg-red-200 text-red-700'
                        }`}
                      >
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-white/70">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ManageBookings
