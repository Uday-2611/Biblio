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
        <Link to={`/product/${id}`} className='block bg-neutral-100 rounded-lg p-4'>
            <div className='aspect-square overflow-hidden rounded-md mb-3'>
                <img className='w-full h-full object-contain' src={image && image[0] ? image[0] : ''} alt={name} />
            </div>
            <div className='flex flex-col gap-2'>
                <h1 className='text-lg font-[SourceSans] font-medium truncate'>{name}</h1>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-[SourceSans] font-semibold'>{price}{currency}</h1>
                    <button onClick={handleAddToCart} className='flex-shrink-0 text-xl hover:text-red-500 transition-colors'>
                        <i className="ri-heart-fill"></i>
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ProductDisplay
