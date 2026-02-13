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
    <div className='app-page'>
      <div className='app-page-content app-surface w-full m-auto flex flex-col gap-8 p-4 sm:p-6 md:p-8 pt-24 md:pt-28'>
        <div className='flex justify-between items-center'>
          <h1 className='font-[Gambarino] text-4xl md:text-5xl text-neutral-900'>MY PURCHASES</h1>
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
