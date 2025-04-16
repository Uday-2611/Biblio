import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDisplay = ({ id, image, name, price }) => {
    const { currency, backendUrl, addToCart, requireAuth } = useContext(ShopContext);

    const getImageUrl = (imagePath) => {
        return `${backendUrl}/uploads/${imagePath}`;
    };

    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevent navigating to product page
        if (requireAuth()) {
            addToCart(id, 1);
            toast.success('Added to cart!');
        }
    };

    return (
        <Link to={`/product/${id}`} className='block bg-white rounded-lg transition-transform hover:-translate-y-1'>
            <div className='aspect-square rounded-lg bg-neutral-100 overflow-hidden'>
                <img 
                    className='w-full h-full object-contain'
                    src={image && image[0] ? getImageUrl(image[0]) : ''} 
                    alt={name} 
                />
            </div>
            <div className='p-4 flex justify-between items-start'>
                <div className='flex-1 min-w-0'>
                    <h1 className='text-lg font-[SourceSans] font-medium truncate'>{name}</h1>
                    <h1 className='text-lg font-[SourceSans] text-neutral-600'>{currency} {price}</h1>
                </div>
                <button 
                    onClick={handleAddToCart}
                    className='ml-2 flex-shrink-0 text-xl hover:text-gray-600 transition-colors'
                >
                    <i className="ri-shopping-cart-2-line"></i>
                </button>
            </div>
        </Link>
    )
}

export default ProductDisplay
