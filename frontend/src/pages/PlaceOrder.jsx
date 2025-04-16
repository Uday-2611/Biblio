import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const { 
    currency, 
    getCartAmount, 
    delivery_fee, 
    navigate, 
    token, 
    cartItems, 
    backendUrl, 
    setCartItems, 
    products 
  } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  }

  // Helper function to get complete image URL
  const getImageUrl = (imagePath) => {
    return `${backendUrl}/uploads/${imagePath}`;
  };

  // Get cart items with product details
  const getCartProducts = () => {
    const cartProducts = [];
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = products.find(p => p._id === itemId);
        if (product) {
          cartProducts.push({
            ...product,
            quantity: cartItems[itemId]
          });
        }
      }
    }
    return cartProducts;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const orderItems = getCartProducts();
      
      if (orderItems.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method
      };

      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { 
        headers: { token } 
      });

      if (response.data.success) {
        setCartItems({});
        toast.success('Order placed successfully!');
        navigate('/home');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const cartProducts = getCartProducts();

  return (
    <div className='w-screen h-screen bg-white overflow-hidden'>
      <div className='flex h-full'>
        <div className='w-1/2 p-16 flex flex-col gap-8 overflow-y-auto scrollbar-none ml-0'>
          <h1 className='font-[Editorial] text-4xl'>Page Turner</h1>

          <div className='font-[SourceSans]'>
            <h2 className='text-sm text-neutral-500 mb-4 text-center'>Payment Method</h2>
            <div className='flex gap-4 w-[80%] m-auto'>
              <button 
                onClick={() => setMethod('googlepay')} 
                className={`w-1/2 py-3 px-6 rounded-lg font-[Monsterat] flex items-center justify-center gap-2 transition-colors
                  ${method === 'googlepay' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-black text-white'}`}
              >
                <i className="ri-google-fill text-xl"></i>
                GOOGLE PAY
              </button>
              <button 
                onClick={() => setMethod('cod')} 
                className={`w-1/2 py-3 px-6 rounded-lg font-[Monsterat] flex items-center justify-center gap-2 transition-colors
                  ${method === 'cod' 
                    ? 'bg-green-500 text-white' 
                    : 'border-2 border-neutral-200 text-black'}`}
              >
                <i className="ri-money-dollar-box-line text-xl"></i>
                CASH ON DELIVERY
              </button>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className='font-[SourceSans] flex flex-col gap-6 w-[80%] m-auto'>
            <h2 className='text-2xl font-medium'>Delivery</h2>
            <div className='flex gap-4'>
              <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='w-1/2 p-4 border-2 border-neutral-200 rounded-lg' />
              <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='w-1/2 p-4 border-2 border-neutral-200 rounded-lg' />
            </div>
            <input required onChange={onChangeHandler} name='address' value={formData.address} type="text" placeholder='Address' className='w-full p-4 border-2 border-neutral-200 rounded-lg' />
            <div className='flex gap-4'>
              <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='w-1/3 p-4 border-2 border-neutral-200 rounded-lg' />
              <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='w-1/3 p-4 border-2 border-neutral-200 rounded-lg' />
              <input required onChange={onChangeHandler} name='zip' value={formData.zip} type="number" placeholder='ZIP Code' className='w-1/3 p-4 border-2 border-neutral-200 rounded-lg' />
            </div>
            <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone' className='w-full p-4 border-2 border-neutral-200 rounded-lg' />
            <button type='submit' className='w-[80%] m-auto bg-[#22df04] text-white font-semibold py-4 rounded-lg font-[Monsterat] text-sm hover:bg-[#21df04d0]'>
              PLACE ORDER
            </button>
          </form>
        </div>

        <div className='w-1/2 bg-[#F5F5F1] p-16 flex flex-col h-full'>
          <div className='flex-grow'>
            {cartProducts.map((item, index) => (
              <div key={index} className='flex gap-4 pb-4 border-b mb-4'>
                <img 
                  src={item.image && item.image[0] ? getImageUrl(item.image[0]) : ''} 
                  alt={item.name} 
                  className='w-20 h-24 object-cover rounded-lg'
                />
                <div className='flex-grow'>
                  <h3 className='font-[SourceSans] text-lg font-medium'>{item.name}</h3>
                  <p className='font-[SourceSans] text-neutral-500'>Quantity: {item.quantity}</p>
                  <p className='font-[SourceSans] font-medium mt-2'>₹{item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='font-[SourceSans]'>
            <div className='flex justify-between py-4 border-b'>
              <span className='text-neutral-500'>Subtotal</span>
              <span className='font-medium'>₹{getCartAmount()}.00</span>
            </div>
            <div className='flex justify-between py-4 border-b'>
              <span className='text-neutral-500'>Delivery</span>
              <span className='font-medium'>₹{delivery_fee}.00</span>
            </div>
            <div className='flex justify-between py-4 text-lg font-medium'>
              <span>Total</span>
              <span>₹{getCartAmount() + delivery_fee}.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
