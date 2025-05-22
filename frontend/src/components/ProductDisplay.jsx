import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductDisplay = ({ id, image, name, price }) => {
    const { currency, addToCart, requireAuth } = useContext(ShopContext);

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (requireAuth()) {
            addToCart(id, 1);
            toast.success('Added to cart!');
        }
    };

    return (
        <Link to={`/product/${id}`} className='block text-white'>
            <div className='aspect-square overflow-hidden '>
                <img className='w-full h-full object-contain' src={image && image[0] ? image[0] : ''} alt={name} />
            </div>
            <div className='p-4 px-14 justify-between items-start'>
                <div className='flex-1 min-w-0'>
                    <h1 className='text-lg font-[SourceSans] font-medium truncate'>{name}</h1>
                </div>
                <div className='flex w-[100%] justify-between'>
                    <h1 className='text-xl font-[SourceSans] text-white'>{price}{currency}</h1>

                    <button onClick={handleAddToCart} className='ml-2 flex-shrink-0 text-xl hover:text-red-500 transition-colors'>
                        <i className="ri-heart-fill"></i>
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ProductDisplay
