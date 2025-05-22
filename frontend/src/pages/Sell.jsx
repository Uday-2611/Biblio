import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import SellProduct from './sellProduct';
import ListProduct from './ListProduct';
import AdminOrders from './AdminOrders';

const Sell = () => {
  return (
    <div className=' w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] flex min-h-screen bg-white'>
      <Sidebar />
      <main className='w-3/4'>
        <Routes>
          <Route index element={<SellProduct />} />
          <Route path="list-products" element={<ListProduct />} />
          <Route path="orders" element={<AdminOrders />} />
        </Routes>
      </main>
    </div>
  );
};

export default Sell; 