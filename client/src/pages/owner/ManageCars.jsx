import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCars = () => {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);

  const fetchOwnerCars = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars');
      if (data.success) {
        setCars(data.cars);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleAvailability = async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteCar = async (carId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this car?');
      if (!confirmDelete) return;

      const { data } = await axios.post('/api/owner/delete-car', { carId });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerCars();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    isOwner && fetchOwnerCars();
  }, [isOwner]);

  return (
    <div className="w-full px-4 pt-10 md:px-10 flex justify-center">
      <div className="w-full max-w-5xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-1">Manage Cars</h1>
        <p className="text-white mb-6">Update car details or availability.</p>

        <div className="overflow-x-auto rounded-xl">
          <table className="min-w-full text-sm text-white">
            <thead className="text-left bg-white/10 backdrop-blur-sm text-yellow-200 uppercase">
              <tr>
                <th className="p-4">Car</th>
                <th className="p-4 max-md:hidden">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4 max-md:hidden">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car, index) => (
                <tr key={index} className="border-t border-white/20">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="max-md:hidden">
                      <p className="font-medium">{car.brand} {car.model}</p>
                      <p className="text-sm">{car.seating_capacity} • {car.transmission}</p>
                    </div>
                  </td>
                  <td className="p-4 max-md:hidden">{car.category}</td>
                  <td className="p-4">{currency} {car.pricePerDay}/day</td>
                  <td className="p-4 max-md:hidden">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${car.isAvailable
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                      }`}>
                      {car.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </td>
                  <td className="p-4 flex gap-4">
                    <button
                      onClick={() => toggleAvailability(car._id)}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition shadow border border-white/30"
                    >
                      <img
                        src={car.isAvailable ? assets.eye_close_icon : assets.eye_icon}
                        alt="Toggle"
                        className="h-6 w-6"
                      />
                    </button>

                    <button
                      onClick={() => deleteCar(car._id)}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-red-200/50 transition shadow border border-white/30"
                    >
                      <img
                        src={assets.delete_icon}
                        alt="Delete"
                        className="h-6 w-6"
                      />
                    </button>
                  </td>

                </tr>
              ))}
              {cars.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-300">No cars found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCars;
