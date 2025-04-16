import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Profile = () => {
  const { navigate, logout, user, backendUrl, token } = useContext(ShopContext);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  }

  const loadSellerProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/my-products`, {
        headers: { token }
      });
      if (response.data.success) {
        setSellerProducts(response.data.products);
      }
    } catch (error) {
      console.error('Error loading seller products:', error);
    }
  };

  const loadRecentOrders = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/order/userorders`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        setRecentOrders(response.data.orders.slice(0, 3)); // Show only 3 most recent orders
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  useEffect(() => {
    if (token) {
      loadSellerProducts();
      loadRecentOrders();
    }
  }, [token]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${backendUrl}/uploads/${imagePath}`;
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
    <>
      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] min-h-screen bg-white'>
        <div className='w-[80%] m-auto flex flex-col gap-8 pt-32'>
          {/* Profile Header */}
          <div className='flex justify-between items-center'>
            <h1 className='font-["SourceSans"] text-5xl'>My Profile</h1>
            <button onClick={handleLogout} className='font-["Monsterat"] text-sm px-6 py-2 rounded-lg border-neutral-300 bg-red-500 transition-all text-white'>
              LOGOUT
            </button>
          </div>

          <hr />

          {/* User Info Section */}
          <div className='flex flex-col gap-4 font-["SourceSans"]'>
            <h2 className='text-2xl font-medium'>Personal Information</h2>
            <div className='flex flex-col gap-2'>
              <p className='text-lg'><span className='text-neutral-500'>Name:</span> {user?.name || 'Not Available'}</p>
              <p className='text-lg'><span className='text-neutral-500'>Email:</span> {user?.email || 'Not Available'}</p>
            </div>
          </div>

          {/* Seller Section */}
          {user?.isSeller && (
            <div className='flex flex-col gap-4 font-["SourceSans"]'>
              <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-medium'>Seller Dashboard</h2>
                <div className='flex gap-4'>
                  <NavLink to='/admin-orders' className='font-["Monsterat"] text-sm border px-6 py-3 rounded-lg bg-black text-white transition-all'>
                    MANAGE ORDERS
                  </NavLink>
                  <NavLink to='/sell'>
                    <button className='bg-[#22df04] text-black px-8 py-3 rounded-lg font-["Monsterat"] text-sm'>
                      SELL A BOOK
                    </button>
                  </NavLink>
                </div>
              </div>

              <div className='grid grid-cols-4 gap-4 mt-4'>
                {sellerProducts.slice(0, 4).map((product) => (
                  <div key={product._id} className='border p-4 rounded-xl'>
                    <img 
                      src={product.image && product.image[0] ? getImageUrl(product.image[0]) : ''} 
                      alt={product.name} 
                      className='w-full h-40 object-cover rounded-lg' 
                    />
                    <h3 className='font-medium mt-2'>{product.name}</h3>
                    <p className='text-neutral-500'>₹{product.price}</p>
                    <p className='text-sm text-neutral-400'>Posted on: {new Date(product.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders Section */}
          <div className='flex flex-col gap-4 font-["SourceSans"] mb-20'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-medium'>Recent Orders</h2>
              <NavLink to='/all-orders' className='font-[Monsterat] text-sm border px-6 py-2 rounded-lg bg-black text-white transition-all'>
                VIEW ALL ORDERS
              </NavLink>
            </div>

            <div className='flex flex-col gap-4'>
              {recentOrders.map((order) => (
                <div key={order._id} className='border rounded-xl p-6'>
                  <div className='flex justify-between items-center mb-4'>
                    <div>
                      <h3 className='font-medium'>Order #{order._id.slice(-6)}</h3>
                      <p className='text-neutral-500'>Ordered on: {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                      {order.status}
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-4'>
                    {order.items.map((item, idx) => (
                      <div key={idx} className='flex gap-4 border-t pt-4'>
                        <img 
                          src={item.image && item.image[0] ? getImageUrl(item.image[0]) : ''} 
                          alt={item.name} 
                          className='w-16 h-20 object-cover rounded-lg'
                        />
                        <div>
                          <h4 className='font-medium'>{item.name}</h4>
                          <p className='text-neutral-500'>₹{item.price}</p>
                          <p>Quantity: {item.quantity}</p>
                          {item.sellerId && (
                            <div className='mt-1 text-sm'>
                              <p className='text-neutral-500'>Seller: {item.sellerId.name}</p>
                              <p className='text-neutral-500'>Contact: {item.sellerId.email}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='mt-4 flex justify-between items-center border-t pt-4'>
                    <div>
                      <p className='text-neutral-500'>Payment: Cash on Delivery</p>
                      <p className='text-neutral-500'>Status: 
                        <span className={order.payment ? 'text-green-600 ml-1' : 'text-yellow-600 ml-1'}>
                          {order.payment ? 'Completed' : 'Pending'}
                        </span>
                      </p>
                    </div>
                    <p className='font-medium'>Total: ₹{order.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OrderDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        orderId={selectedOrder}
      />
    </>
  );
};

export default Profile;
