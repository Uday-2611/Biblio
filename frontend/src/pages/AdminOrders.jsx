import React, { useState, useEffect, useContext, useCallback } from 'react'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminOrders = () => {
  const { backendUrl, token } = useContext(ShopContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    'Order Placed',
    'Confirmed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  const loadOrders = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { token }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
      setLoading(false);
    }
  }, [backendUrl, token]);

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token, loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(orders.map(order =>
          order._id === orderId ? response.data.order : order
        ));
        toast.success('Order status updated');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

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
    <div className='w-full min-h-screen p-4 sm:p-6 md:p-8 pt-24 md:pt-28'>
      <div className='w-full m-auto'>
        <h1 className='font-[Gambarino] text-4xl md:text-5xl text-neutral-900 mb-8'>ORDERS</h1>
        {loading ? (
          <div className="text-center py-8">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-8">No orders found</div>
        ) : (
          <div className='overflow-x-auto rounded-2xl border border-white/90 bg-white/85 p-2 sm:p-4 shadow-sm'>
            <table className='w-full'>
              <thead className='bg-neutral-50/95'>
                <tr>
                  <th className='p-4 text-left'>Order ID</th>
                  <th className='p-4 text-left'>Products</th>
                  <th className='p-4 text-left'>Customer Details</th>
                  <th className='p-4 text-left'>Date</th>
                  <th className='p-4 text-left'>Amount</th>
                  <th className='p-4 text-left'>Payment</th>
                  <th className='p-4 text-left'>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className='border-b'>
                    <td className='p-4'>{order._id}</td>
                    <td className='p-4'>
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 mb-2">
                          {item.image && item.image[0] && (
                            <img src={item.image[0]} alt={item.name} className="w-12 h-12 object-contain rounded-sm" />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className='p-4'>
                      <div>
                        <p className='text-sm'>{order.address.firstName} {order.address.lastName}</p>
                        <p className='text-sm text-neutral-500'>{order.address.address}</p>
                        <p className='text-sm text-neutral-500'>{order.address.city}, {order.address.state} {order.address.zip}</p>
                        <p className='text-sm text-neutral-500'>Phone: {order.address.phone}</p>
                      </div>
                    </td>
                    <td className='p-4'>{new Date(order.date).toLocaleDateString()}</td>
                    <td className='p-4'>₹{order.amount}</td>
                    <td className='p-4'>
                      <div>
                        <p>Cash on Delivery</p>
                        <span className={order.payment ? 'text-green-600' : 'text-yellow-600'}>
                          {order.payment ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className='p-4'>
                      <select value={order.status} onChange={(e) => handleStatusChange(order._id, e.target.value)} className={`px-3 py-1 rounded-full text-sm bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 border-0`} >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminOrders
