import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBooking from './pages/MyBooking';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageBookings from './pages/owner/ManageBookings';
import ManageCars from './pages/owner/ManageCars';
import Login from './components/Login';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import { ConfirmProvider } from './components/ConfirmDialog';
const App = () => {
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith('/owner');

  return (
    <ConfirmProvider> 
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#101927] to-[#1c1c1c] text-white">
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && <Navbar />}

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/car-details/:id' element={<CarDetails />} />
        <Route path='/cars' element={<Cars />} />
        <Route path='/my-bookings' element={<MyBooking />} />
        <Route path='/owner' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-car' element={<AddCar />} />
          <Route path='manage-bookings' element={<ManageBookings />} />
          <Route path='manage-cars' element={<ManageCars />} />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </div>
    </ConfirmProvider>
  );
};

export default App;
