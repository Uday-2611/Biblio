import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext'
import CartTotal from './CartTotal'
import PropTypes from 'prop-types'

const Cart = ({ isOpen, onClose }) => {
  const { products, currency, cartItems, updateQuantity, navigate, setCartItems } = useContext(ShopContext);
  const [cartData, setCartData] = useState([])

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const items in cartItems) {
        if (cartItems[items] > 0) {
          tempData.push({
            _id: items,
            quantity: cartItems[items]
          })
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClearCart = () => {
    setCartItems({});
    localStorage.removeItem('cartItems');
    setCartData([]);
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity duration-300 z-40 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      <div className={`fixed right-3 sm:right-5 top-20 sm:top-24 bottom-4 w-[92vw] sm:w-[380px] md:w-[440px] bg-neutral-50 border border-neutral-200 shadow-2xl rounded-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>
        <div className='flex flex-col h-full'>
          <div className='px-4 sm:px-6 py-5 border-b border-neutral-200'>
            <div className='flex justify-between items-center'>
              <h1 className='font-[Monsterat] text-3xl sm:text-4xl font-semibold'>YOUR CART</h1>
              <button onClick={onClose} className='text-black hover:text-neutral-600 transition-colors'>
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {cartData.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-neutral-500'>
                <i className="ri-shopping-cart-line text-4xl mb-2"></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className='p-4 sm:p-6 space-y-4'>
                {cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id);
                  if (!productData) return null;

                  return (
                    <div key={index} className='flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 bg-white hover:bg-neutral-100 transition rounded-xl border border-neutral-200'>
                      <div className='w-20 sm:w-16 h-20 sm:h-16 overflow-hidden flex-shrink-0'>
                        <img src={productData.image && productData.image[0] ? productData.image[0] : ''} className='w-full h-full object-contain' alt={productData.name} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='uppercase truncate pr-8 text-lg sm:text-base'>{productData.name}</h3>
                        <p className='text-neutral-600 text-lg sm:text-base'>{currency}{productData.price}</p>
                      </div>
                      <div className='flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-start'>
                        <div className='flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white'>
                          <button onClick={() => {
                            const newValue = Math.max(1, item.quantity - 1);
                            updateQuantity(item._id, newValue);
                          }} className='px-2 sm:px-1 py-2 sm:py-1 hover:bg-neutral-100 transition-colors'>
                            <i className="ri-subtract-line"></i>
                          </button>
                          <input value={item.quantity} readOnly className='w-12 py-2 sm:py-1 text-center text-lg sm:text-base bg-white' type="text" />
                          <button onClick={() => {
                            updateQuantity(item._id, item.quantity + 1);
                          }} className='px-2 sm:px-1 py-2 sm:py-1 hover:bg-neutral-100 transition-colors'>
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                        <button onClick={() => updateQuantity(item._id, 0)} className='text-black hover:text-red-500 transition-colors p-2 text-xl sm:text-base'>
                          <i className="ri-delete-bin-7-line"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className='p-4 sm:p-6 mt-auto'>
            <CartTotal />
            <div className='flex flex-col sm:flex-row gap-4 mt-4'>
              {cartData.length > 0 && (
                <button onClick={handleClearCart} className='w-full sm:w-1/2 bg-red-600 text-white py-3 font-[Monsterat] transition-colors hover:bg-red-500 text-sm sm:text-base rounded-lg'>
                  CLEAR CART
                </button>
              )}
              <button onClick={() => {
                navigate('/place-order');
                onClose();
              }} disabled={cartData.length === 0} className={`${cartData.length > 0 ? 'w-full sm:w-1/2' : 'w-full'} bg-neutral-900 text-white py-3 font-[Monsterat] transition-colors hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base rounded-lg`}>
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Cart.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Cart
