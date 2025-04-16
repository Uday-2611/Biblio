import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import CartTotal from './CartTotal'

const Cart = ({ isOpen, onClose }) => {
  const { products, currency, cartItems, updateQuantity, navigate, backendUrl } = useContext(ShopContext);
  const [cartData, setCartData] = useState([])

  const getImageUrl = (imagePath) => {
    return `${backendUrl}/uploads/${imagePath}`;
  };

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

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Cart Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-screen w-[480px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='px-6 py-4 border-b'>
            <div className='flex justify-between items-center'>
              <h1 className='font-[SourceSans] text-2xl font-medium'>Shopping Cart</h1>
              <button 
                onClick={onClose} 
                className='text-neutral-400 hover:text-neutral-600 transition-colors'
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
          </div>

          {/* Cart Items - Scrollable */}
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
                    <div key={index} className='flex items-center gap-6 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors'>
                      <img 
                        src={productData.image && productData.image[0] ? getImageUrl(productData.image[0]) : ''} 
                        className='w-16 h-20 object-cover rounded-md flex-shrink-0' 
                        alt={productData.name}
                      />
                      <div className='flex-1 min-w-0'>
                        <h3 className='font-medium text-lg truncate pr-8'>{productData.name}</h3>
                        <p className='text-neutral-600'>{currency}{productData.price}</p>
                      </div>
                      <div className='flex items-center gap-6'>
                        <div className='flex items-center gap-2'>
                          <input
                            value={item.quantity}
                            onChange={(e) => {
                              const newValue = e.target.value;
                              if (newValue === '' || newValue === '0') {
                                updateQuantity(item._id, 0);
                              } else {
                                updateQuantity(item._id, Number(newValue));
                              }
                            }}
                            className='w-16 px-2 py-1 border rounded-md text-center'
                            type="number"
                            min={1}
                          />
                        </div>
                        <button
                          onClick={() => updateQuantity(item._id, 0)}
                          className='text-neutral-400 hover:text-red-500 transition-colors p-2'
                        >
                          <i className="ri-delete-bin-line text-xl"></i>
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
            <button 
              onClick={() => {
                navigate('/place-order');
                onClose();
              }} 
              disabled={cartData.length === 0}
              className='w-full bg-[#22df04] text-black py-3 rounded-lg font-medium text-lg mt-4 
                font-[Monsterat] transition-colors hover:bg-[#1fc704] disabled:opacity-50 
                disabled:cursor-not-allowed'
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Cart
