import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './components/Login';

import Home from './pages/Home';
import CarDetails from './pages/CarDetails';
import Cars from './pages/Cars';
import MyBookings from './pages/MyBookings';
import Gears from './pages/Gears';
import ContactUs from './pages/ContactUs';

import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import AddCar from './pages/owner/AddCar';
import ManageCars from './pages/owner/ManageCars';
import ManageGear from './pages/owner/ManageGear'
import ManageBookings from './pages/owner/ManageBookings';
import GearDetails from './pages/GearDetails';
import AddGear from './pages/owner/AddGear';

import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/AppContext';
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  const { showLogin } = useAppContext();
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');

  return (
    <>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && <Navbar />}
      <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/trip-gears" element={<Gears />} />
        <Route path="/gear-details/:id" element={<GearDetails />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Owner Routes */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-gears" element={<ManageGear />} />

          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="add-gear" element={<AddGear />} />
        </Route>

      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
