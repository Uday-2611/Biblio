import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
    const { currency, getCartAmount, delivery_fee } = useContext(ShopContext);

    // Generate random barcode pattern with varying breadths
    const generateBarcode = () => {
        const widths = [1, 2, 2, 3, 3, 4, 5]; // More variety in widths, with 2 and 3 more common
        return Array.from({ length: 60 }, () => widths[Math.floor(Math.random() * widths.length)]);
    };

    const barcodePattern = generateBarcode();

    return (
        <div className='font-[SourceSans] bg-neutral-100 p-6 pb-8 relative rounded-lg' style={{ position: 'relative' }}>
            {/* Line Items */}
            <div className='space-y-3 mb-4'>
                <div className='flex justify-between items-center text-gray-700'>
                    <span className='text-sm'>Subtotal</span>
                    <span className='text-sm font-medium'>{currency}{getCartAmount()}.00</span>
                </div>
                <div className='flex justify-between items-center text-gray-700'>
                    <span className='text-sm'>Delivery Fee</span>
                    <span className='text-sm font-medium'>{currency}{delivery_fee}.00</span>
                </div>
            </div>

            {/* Dashed Divider */}
            <div className='border-t-2 border-dashed border-gray-300 my-4'></div>

            {/* Grand Total */}
            <div className='flex justify-between items-center mb-6'>
                <span className='text-xl font-bold text-gray-900'>TOTAL</span>
                <span className='text-2xl font-bold text-gray-900'>{currency}{getCartAmount() + delivery_fee}.00</span>
            </div>

            {/* Barcode */}
            <div className='flex justify-center items-center gap-[1px] h-16 mb-2'>
                {barcodePattern.map((width, index) => (
                    <div
                        key={index}
                        className='bg-black'
                        style={{
                            width: `${width}px`,
                            height: '50px'
                        }}
                    />
                ))}
            </div>
        </div>
    )
}

export default CartTotal