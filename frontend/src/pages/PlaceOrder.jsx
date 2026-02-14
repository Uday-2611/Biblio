import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  })

  const { getCartAmount, delivery_fee, navigate, token, cartItems, backendUrl, setCartItems, products } = useContext(ShopContext)

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value
    setFormData((data) => ({ ...data, [name]: value }))
  }

  const getCartProducts = () => {
    const cartProducts = []
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const product = products.find((p) => p._id === itemId)
        if (product) {
          cartProducts.push({
            ...product,
            quantity: cartItems[itemId]
          })
        }
      }
    }
    return cartProducts
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      const orderItems = getCartProducts()

      if (orderItems.length === 0) {
        toast.error('Your cart is empty')
        return
      }

      const orderData = {
        address: formData,
        items: orderItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity
        })),
        paymentMethod: 'cod'
      }

      const response = await axios.post(`${backendUrl}/api/order/place`, orderData, {
        headers: { token }
      })

      if (response.data.success) {
        setCartItems({})
        toast.success('Order placed successfully!')
        navigate('/home')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const cartProducts = getCartProducts()

  return (
    <section className='relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 md:px-8 md:py-8'>
      <div className='absolute inset-0 bg-[#f9f6f1]'></div>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,157,85,0.38)_0%,_rgba(211,194,255,0.26)_44%,_rgba(249,246,241,0.92)_72%)]'></div>
      <div className='absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#ffbb85]/35 blur-3xl'></div>

      <div className='relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 rounded-[34px] border border-white/70 bg-white/50 p-4 shadow-[0_16px_36px_rgba(25,25,35,0.12)] backdrop-blur-xl lg:grid-cols-[1.35fr_0.95fr]'>
        <div className='rounded-[26px] bg-white/75 p-5 sm:p-8 md:p-10'>
          <p className='w-fit rounded-full border border-white/80 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.14em] text-neutral-700'>
            SECURE CHECKOUT
          </p>
          <h1 className='mt-4 font-[Gambarino] text-5xl leading-none text-neutral-900 sm:text-6xl'>Biblio</h1>

          <div className='mt-6 rounded-2xl border border-white/85 bg-white/70 p-4 sm:p-5'>
            <div className='flex items-center gap-3 font-[SourceSans]'>
              <i className='ri-money-dollar-box-line text-xl text-neutral-800'></i>
              <div>
                <h2 className='text-lg font-semibold text-neutral-900'>Cash on Delivery</h2>
                <p className='text-sm text-neutral-600'>Pay when you receive your order</p>
              </div>
            </div>
          </div>

          <form onSubmit={onSubmitHandler} className='mt-8 flex max-w-3xl flex-col gap-4 font-[SourceSans]'>
            <h2 className='font-[Gambarino] text-3xl text-neutral-900 sm:text-4xl'>Delivery Details</h2>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type='text' placeholder='First Name' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />
              <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type='text' placeholder='Last Name' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />
            </div>

            <input required onChange={onChangeHandler} name='address' value={formData.address} type='text' placeholder='Address' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <input required onChange={onChangeHandler} name='city' value={formData.city} type='text' placeholder='City' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />
              <input required onChange={onChangeHandler} name='state' value={formData.state} type='text' placeholder='State' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />
              <input required onChange={onChangeHandler} name='zip' value={formData.zip} type='number' placeholder='ZIP Code' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />
            </div>

            <input required onChange={onChangeHandler} name='phone' value={formData.phone} type='number' placeholder='Phone' className='rounded-xl border border-white/85 bg-white/80 px-4 py-3.5 text-neutral-800 outline-none placeholder:text-neutral-500 focus:border-neutral-300' />

            <button type='submit' className='group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-b from-neutral-900 to-neutral-800 px-6 py-3.5 text-sm font-semibold tracking-[0.14em] text-white transition-colors duration-300 ease-out hover:text-neutral-900 sm:w-fit'>
              <span className='pointer-events-none absolute inset-0 bg-gradient-to-r from-[#f99d55] via-[#d3c2ff] to-[#f9f6f1] opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100'></span>
              <span className='relative z-10'>PLACE ORDER</span>
            </button>
          </form>
        </div>

        <div className='flex h-full flex-col rounded-[26px] border border-white/80 bg-gradient-to-b from-[#eef6ff] via-[#ffffff] to-[#f0eefc] p-5 sm:p-8 md:p-9 text-neutral-900'>
          <h2 className='font-[Gambarino] text-3xl sm:text-4xl'>Order Summary</h2>

          <div className='mt-5 max-h-[44vh] flex-1 overflow-y-auto pr-1'>
            {cartProducts.map((item, index) => (
              <div key={index} className='mb-4 flex gap-3 border-b border-neutral-200 pb-4'>
                <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white p-1 shadow-sm sm:h-20 sm:w-20'>
                  <img src={item.image && item.image[0] ? item.image[0] : ''} alt={item.name} className='h-full w-full object-contain' />
                </div>
                <div className='flex-grow font-[SourceSans]'>
                  <h3 className='text-base sm:text-lg text-neutral-900'>{item.name}</h3>
                  <p className='text-sm text-neutral-600'>Quantity: {item.quantity}</p>
                  <p className='mt-1 text-base font-semibold sm:text-lg text-neutral-900'>Rs. {item.price * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-auto rounded-2xl border border-neutral-200 bg-white/90 p-4 font-[SourceSans] shadow-sm'>
            <div className='flex justify-between py-2.5 text-lg font-semibold'>
              <span className='text-neutral-700'>Subtotal</span>
              <span className='text-neutral-900'>Rs. {getCartAmount()}.00</span>
            </div>
            <div className='flex justify-between py-2.5 text-lg font-semibold'>
              <span className='text-neutral-700'>Delivery</span>
              <span className='text-neutral-900'>Rs. {delivery_fee}.00</span>
            </div>
            <div className='mt-2 flex justify-between border-t border-neutral-300 py-3 text-2xl font-bold'>
              <span className='text-neutral-900'>Total</span>
              <span className='text-neutral-900'>Rs. {getCartAmount() + delivery_fee}.00</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PlaceOrder
