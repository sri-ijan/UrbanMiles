import React, { useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    Revenue: 0,
  });

  const dashboardCards = [
    { title: 'Total Cars', value: data.totalCars, icon: assets.carIconColored },
    { title: 'Total Bookings', value: data.totalBookings, icon: assets.listIconColored },
    { title: 'Pending', value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: 'Confirmed', value: data.completedBookings, icon: assets.carIconColored },
  ];

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/owner/dashboard');
      if (data.success) {
        setData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isOwner) {
      fetchDashboardData();
    }
  }, [isOwner]);

  return (
    <div className="flex justify-center items-start min-h-screen px-4 py-10 md:px-10 bg-gradient-to-r from-black to-gray-900">
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md p-6 md:p-10 rounded-2xl shadow-lg border border-white/20 text-white">
        <h1 className="text-3xl font-semibold text-[#D4AF37] mb-1">Admin Dashboard</h1>
        <p className="text-base mb-6">Monitor overall platform performance including total cars, bookings, revenue, and recent activities.</p>

        {/* Dashboard Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              className="flex gap-2 items-center justify-between p-4 rounded-xl border border-white/20 bg-white/20 backdrop-blur-sm shadow-md"
            >
              <div>
                <h1 className="text-xs text-gray-200">{card.title}</h1>
                <p className="text-lg font-semibold text-white">{card.value}</p>
              </div>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20">
                <img src={card.icon} alt="" className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>

        {/* Recent Bookings + Monthly Revenue */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Recent Bookings */}
          <div className="flex-1 p-6 border border-white/20 rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
            <h1 className="text-xl font-semibold mb-1">Recent Bookings</h1>
            <p className="text-gray-300 mb-4">Latest booking activity</p>
            {data.recentBookings.map((booking, index) => (
              <div key={index} className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-white/20">
                    <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                  </div>
                  <div>
                    <p>{booking.car.brand} {booking.car.model}</p>
                    <p className="text-sm text-gray-300">{booking.createdAt.split('T')[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-300">{currency}{booking.price}</p>
                  <p className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
                  }`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Revenue */}
          <div className="w-full lg:max-w-xs p-6 border border-white/20 rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
            <h1 className="text-xl font-semibold mb-1">Your Revenue</h1>
            <p className="text-gray-300 mb-6">Revenue for lifetime</p>
            <p className="text-3xl font-bold text-[#D4AF37]">{currency}{data.Revenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
