import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
    const { currency, getCartAmount, delivery_fee } = useContext(ShopContext);

    return (
        <div className='font-[SourceSans]'>
            <div className='flex justify-between items-center text-neutral-600 text-base sm:text-lg'>
                <span>Subtotal</span>
                <span>{currency}{getCartAmount()}.00</span>
            </div>
            <div className='flex justify-between items-center mt-2 text-neutral-600 text-base sm:text-lg'>
                <span>Delivery Fee</span>
                <span>{currency}{delivery_fee}.00</span>
            </div>
            <div className='flex justify-between items-center mt-4 pt-4 border-t text-lg sm:text-xl font-medium'>
                <span>TOTAL</span>
                <span>{currency}{getCartAmount() + delivery_fee}.00</span>
            </div>
        </div>
    )
}

export default CartTotal