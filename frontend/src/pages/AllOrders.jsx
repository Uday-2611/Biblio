import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import Order from '../components/Order';
import axios from 'axios';

const AllOrders = () => {
  const [orderData, setOrderData] = useState([]);
  const { backendUrl, token, currency } = useContext(ShopContext);

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if (response.data.success) {
        setOrderData(response.data.orders.reverse());
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    loadOrderData();
    const interval = setInterval(loadOrderData, 30000);
    return () => clearInterval(interval);
  }, [loadOrderData]);

  return (
    <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] min-h-screen bg-white'>
      <div className='w-[80%] m-auto flex flex-col gap-8 pt-32'>
        <div className='flex justify-between items-center'>
          <h1 className='font-["Monsterat"] text-5xl font-semibold'>MY PURCHASES</h1>
        </div>

        <hr />

        <div className='flex flex-col gap-6 mb-20 font-["SourceSans"]'>
          {orderData.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">No orders found</div>
          ) : (
            orderData.map((order) => (
              <Order key={order._id} order={order} backendUrl={backendUrl} currency={currency} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AllOrders;