import { useContext, useEffect, useState } from 'react'
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
      {/* OVERLAY */}
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />

      {/* CART */}
      <div className={`fixed right-0 top-0 h-screen w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className='flex flex-col h-full'>
          {/* HEADER */}
          <div className='px-6 py-4'>
            <div className='flex justify-between items-center'>
              <h1 className='font-[Monsterat] tracking-wider text-4xl font-semibold'>BAG</h1>
              <button onClick={onClose} className='text-black hover:text-neutral-600 transition-colors'>
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>

          {/* CART ITEMS */}
          <div className='flex-1 overflow-y-auto'>
            {cartData.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-neutral-500'>
                <i className="ri-shopping-cart-line text-4xl mb-2"></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className='p-6 space-y-4'>
                {cartData.map((item, index) => {
                  const productData = products.find((product) => product._id === item._id);
                  if (!productData) return null;

                  return (
                    <div key={index} className='flex items-center gap-6 p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors'>
                      <div className='w-16 h-16 overflow-hidden flex-shrink-0'>
                        <img src={productData.image && productData.image[0] ? productData.image[0] : ''} className='w-full h-full object-contain' alt={productData.name} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h3 className='uppercase truncate pr-8'>{productData.name}</h3>
                        <p className='text-neutral-600'>{currency}{productData.price}</p>
                      </div>
                      <div className='flex items-center gap-6'>
                        <div className='flex items-center border'>
                          <button onClick={() => {
                            const newValue = Math.max(1, item.quantity - 1);
                            updateQuantity(item._id, newValue);
                          }} className='px-1 py-1 hover:bg-neutral-100 transition-colors'>
                            <i className="ri-subtract-line"></i>
                          </button>

                          <input value={item.quantity} readOnly className='w-12 py-1 text-center' type="text" />

                          <button onClick={() => {
                            updateQuantity(item._id, item.quantity + 1);
                          }} className='px-1 py-1 hover:bg-neutral-100 transition-colors'>
                            <i className="ri-add-line"></i>
                          </button>
                        </div>
                        <button onClick={() => updateQuantity(item._id, 0)} className='text-black hover:text-red-500 transition-colors p-2'>
                          <i className="ri-delete-bin-7-line"></i>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='border-t p-6 bg-white'>
            <CartTotal />
            <div className='flex gap-4 mt-4'>
              {cartData.length > 0 && (
                <button 
                  onClick={handleClearCart} 
                  className='w-1/2 bg-red-500 text-white py-3 font-[Monsterat] transition-colors hover:bg-red-600'
                >
                  CLEAR CART
                </button>
              )}
              <button 
                onClick={() => {
                  navigate('/place-order');
                  onClose();
                }} 
                disabled={cartData.length === 0} 
                className={`${cartData.length > 0 ? 'w-1/2' : 'w-full'} bg-[#22df04] text-white py-3 font-[Monsterat] transition-colors hover:bg-[#21df04d0] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Cart.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default Cart
