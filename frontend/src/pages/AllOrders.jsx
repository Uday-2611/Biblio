import React, { useContext, useEffect, useState } from 'react';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const AllOrders = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState([]);

  const { backendUrl, token, currency } = useContext(ShopContext);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      if(response.data.success) {
        setOrderData(response.data.orders.reverse()); 
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
    // Set up polling to check for updates every 30 seconds
    const interval = setInterval(loadOrderData, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'yellow',
      'Confirmed': 'blue',
      'Shipped': 'indigo',
      'Out for Delivery': 'purple',
      'Delivered': 'green',
      'Cancelled': 'red'
    };
    return colors[status] || 'gray';
  };

  return (
    <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] min-h-screen bg-white'>
      <div className='w-[80%] m-auto flex flex-col gap-8 pt-32'>
        {/* Header */}
        <div className='flex justify-between items-center'>
          <h1 className='font-["SourceSans"] text-5xl'>Order History</h1>
        </div>

        <hr />

        {/* Orders List */}
        <div className='flex flex-col gap-6 mb-20 font-["SourceSans"]'>
          {orderData.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">No orders found</div>
          ) : (
            orderData.map((order) => (
              <div key={order._id} className='border rounded-xl p-6'>
                <div className='flex justify-between items-center mb-4'>
                  <div>
                    <h3 className='font-medium text-lg'>Order #{order._id.slice(-6)}</h3>
                    <p className='text-neutral-500'>Ordered on: {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-full text-sm bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 font-medium`}>
                    {order.status}
                  </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                  {order.items.map((item, idx) => (
                    <div key={idx} className='flex gap-4 border-t pt-4 w-full md:w-[calc(50%-1rem)]'>
                      <img 
                        src={item.image && item.image[0] ? `${backendUrl}/uploads/${item.image[0]}` : ''} 
                        alt={item.name} 
                        className='w-20 h-24 object-cover rounded-lg'
                      />
                      <div className='flex-1'>
                        <h4 className='font-medium'>{item.name}</h4>
                        <p className='text-neutral-500'>{currency}{item.price}</p>
                        <p>Quantity: {item.quantity}</p>
                        {item.sellerId && (
                          <div className='mt-2 text-sm'>
                            <p className='text-neutral-500'>Seller: {item.sellerId.name}</p>
                            <p className='text-neutral-500'>Contact: {item.sellerId.email}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-4 pt-4 border-t flex justify-between items-center'>
                  <div>
                    <p className='text-neutral-500'>Payment Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Google Pay'}</p>
                    <p className='text-neutral-500'>Payment Status: 
                      <span className={order.payment ? 'text-green-600 ml-1' : 'text-yellow-600 ml-1'}>
                        {order.payment ? 'Completed' : 'Pending'}
                      </span>
                    </p>
                  </div>
                  <p className='font-medium text-lg'>Total: {currency}{order.amount}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrder}
      />
    </div>
  );
};

export default AllOrders;
