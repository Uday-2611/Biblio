import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const { getCartAmount, delivery_fee, navigate, token, cartItems, backendUrl, setCartItems, products } = useContext(ShopContext);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(data => ({ ...data, [name]: value }));
  }

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
        paymentMethod: 'cod'
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
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const cartProducts = getCartProducts();

  return (
    <div className='min-h-screen w-full bg-white flex flex-col md:flex-row'>
      <div className='w-full md:w-[60%] p-4 sm:p-8 md:p-16 flex flex-col gap-8 overflow-y-auto'>
        <h1 className='font-[Stardom] text-red-600 text-4xl sm:text-5xl tracking-tighter'>Biblio</h1>

        <div className='font-[SourceSans] bg-neutral-50 p-4 sm:p-6 rounded-lg'>
          <div className='flex items-center gap-3'>
            <i className="ri-money-dollar-box-line text-xl"></i>
            <div>
              <h2 className='font-medium'>Cash on Delivery</h2>
              <p className='text-sm text-neutral-600'>Pay when you receive your order</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmitHandler} className='font-[Monsterat] flex flex-col gap-6 w-full sm:w-[90%] md:w-[80%]'>
          <h2 className='text-xl sm:text-2xl font-medium'>DELIVERY</h2>

          <div className='flex flex-col sm:flex-row gap-4'>
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" placeholder='First Name' className='w-full sm:w-1/2 p-3 sm:p-4 bg-neutral-200' />
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" placeholder='Last Name' className='w-full sm:w-1/2 p-3 sm:p-4 bg-neutral-200' />
          </div>

          <input required onChange={onChangeHandler} name='address' value={formData.address} type="text" placeholder='Address' className='w-full p-3 sm:p-4 bg-neutral-200' />

          <div className='flex flex-col sm:flex-row gap-4'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" placeholder='City' className='w-full sm:w-1/3 p-3 sm:p-4 bg-neutral-200' />
            <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" placeholder='State' className='w-full sm:w-1/3 p-3 sm:p-4 bg-neutral-200' />
            <input required onChange={onChangeHandler} name='zip' value={formData.zip} type="number" placeholder='ZIP Code' className='w-full sm:w-1/3 p-3 sm:p-4 bg-neutral-200' />
          </div>

          <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" placeholder='Phone' className='w-full p-3 sm:p-4 bg-neutral-200' />

          <button type='submit' className='w-full m-auto bg-[#22df04] text-white font-medium p-3 sm:p-4 hover:bg-[#21df04d0] transition-colors'>
            PLACE ORDER
          </button>
        </form>
      </div>

      <div className='w-full md:w-[40%] bg-[#161616] text-white p-4 sm:p-8 md:p-16 flex flex-col h-auto md:h-screen font-[Monsterat]'>
        <div className='flex-grow overflow-y-auto'>
          <h2 className='text-xl sm:text-2xl mb-6'>ORDER SUMMARY</h2>
          {cartProducts.map((item, index) => (
            <div key={index} className='flex gap-4 pb-4 border-b border-neutral-800 mb-4'>
              <div className='w-16 sm:w-20 h-16 sm:h-20 overflow-hidden flex-shrink-0'>
                <img src={item.image && item.image[0] ? item.image[0] : ''} alt={item.name} className='w-full h-full object-contain' />
              </div>
              <div className='flex-grow'>
                <h3 className='text-base sm:text-lg'>{item.name}</h3>
                <p className='text-neutral-400'>Quantity: {item.quantity}</p>
                <p className='mt-2 text-base sm:text-lg'>₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className='mt-auto pt-4'>
          <div className='flex justify-between py-4 border-b border-neutral-800'>
            <span className='text-neutral-300'>SUBTOTAL</span>
            <span className='font-medium'>₹{getCartAmount()}.00</span>
          </div>
          <div className='flex justify-between py-4 border-b border-neutral-800'>
            <span className='text-neutral-300'>DELIVERY</span>
            <span className='font-medium'>₹{delivery_fee}.00</span>
          </div>
          <div className='flex justify-between py-4 text-lg font-medium'>
            <span>TOTAL</span>
            <span>₹{getCartAmount() + delivery_fee}.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
