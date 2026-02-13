import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SellProduct from './sellProduct';
import ListProduct from './ListProduct';
import AdminOrders from './AdminOrders';

const Sell = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className='app-page'>
      <div className='app-page-content app-surface flex min-h-screen relative p-0'>
      {/* Mobile Menu Button */}
      <button className="md:hidden fixed top-24 left-4 z-50 text-2xl bg-white p-2 rounded-full shadow-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} >
        <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line`}></i>
      </button>

      {/* Sidebar with mobile responsive behavior */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:static top-0 left-0 z-40 h-screen md:w-1/4`}>
        <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Main Content */}
      <main className='w-full md:w-3/4 min-h-screen bg-transparent'>
        <Routes>
          <Route index element={<SellProduct />} />
          <Route path="list-products" element={<ListProduct />} />
          <Route path="orders" element={<AdminOrders />} />
        </Routes>
      </main>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)} />
      )}
      </div>
    </div>
  );
};

export default Sell;
