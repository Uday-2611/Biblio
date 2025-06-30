import { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Order from '../components/Order';

const Profile = () => {
  const { navigate, logout, user, backendUrl, token } = useContext(ShopContext);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);

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
        setRecentOrders(response.data.orders.slice(0, 1));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleProductClick = async (product) => {
    setSelectedProduct(product);
    await loadProductReviews(product._id);
    setShowReviews(true);
  };

  useEffect(() => {
    if (token) {
      loadSellerProducts();
      loadRecentOrders();
    }
  }, [token]);

  return (
    <>
      <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] min-h-screen bg-white'>
        <div className='w-[90%] md:w-[80%] m-auto flex flex-col gap-8 pt-24 md:pt-32'>
          
          <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
            <h1 className='font-["Monsterat"] text-3xl md:text-5xl font-semibold text-center sm:text-left'>ACCOUNT</h1>
            <button onClick={handleLogout} className='font-["Monsterat"] text-sm px-6 py-3 bg-red-500 transition-all text-white w-full sm:w-auto'>
              LOGOUT
            </button>
          </div>

          <hr />

          <div className='flex flex-col gap-4 font-["SourceSans"]'>
            <div className='flex flex-col gap-2'>
              <p className='text-base md:text-lg'><span>Welcome </span> {user?.name || 'Not Available'}</p>
              <p className='text-base md:text-lg'><span>Member Email:</span> {user?.email || 'Not Available'}</p>
            </div>
          </div>

          <div className='flex flex-col gap-4 font-["SourceSans"] mb-14'>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
              <h2 className='text-2xl md:text-3xl font-[Monsterat] font-medium text-center sm:text-left'>RECENT ORDERS</h2>
              <NavLink to='/all-orders' className='font-[Monsterat] text-sm px-6 py-3 bg-black text-white transition-all w-full sm:w-auto text-center'>
                VIEW ALL
              </NavLink>
            </div>

            <div className='flex flex-col gap-4'>
              {recentOrders.map((order) => (
                <Order key={order._id} order={order} backendUrl={backendUrl} currency="₹" onProductClick={(productId) => navigate(`/product/${productId}`)} />
              ))}
            </div>
          </div>

          {user?.isSeller && (
            <div className='flex flex-col gap-4 font-["SourceSans"] mb-20'>
              <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                <h2 className='text-2xl md:text-3xl font-[Monsterat] font-medium text-center sm:text-left'>SELL A BOOK</h2>
                <NavLink to='/sell' className='font-["Monsterat"] text-sm px-6 py-3 bg-black text-white transition-all w-full sm:w-auto text-center'>
                  MANAGE ORDERS
                </NavLink>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4'>
                {sellerProducts.slice(0, 4).map((product) => (
                  <div key={product._id} className='p-4 rounded-sm bg-neutral-100 cursor-pointer hover:bg-neutral-200 transition-all' onClick={() => handleProductClick(product)}>
                    <img src={product.image && product.image[0] ? product.image[0] : ''} alt={product.name} className='w-full h-48 object-contain object-center rounded-sm'/>
                    <h3 className='font-medium mt-2 font-[Monsterat]'>{product.name}</h3>
                    <div className='flex w-full justify-between items-center'>
                      <p className='text-neutral-500'>₹{product.price}</p>
                      <p className='text-neutral-500'>{new Date(product.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showReviews && selectedProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white p-6 md:p-8 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl md:text-2xl font-[Monsterat]'>Reviews for {selectedProduct.name}</h2>
              <button onClick={() => setShowReviews(false)} className='text-2xl hover:text-red-500'>
                ×
              </button>
            </div>
            
            <div className='space-y-4'>
              {reviews.length === 0 ? (
                <p className='text-center text-gray-500'>No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id} className='border-b pb-4'>
                    <div className='flex justify-between items-start'>
                      <div>
                        <p className='font-medium'>{review.userId.name}</p>
                        <div className='flex items-center gap-2'>
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-${i < review.rating ? 'yellow' : 'gray'}-400`}>★</span>
                          ))}
                        </div>
                        <p className='mt-2'>{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
