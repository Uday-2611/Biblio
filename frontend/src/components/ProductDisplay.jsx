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
        <Link to={`/product/${id}`} className='group block rounded-2xl border border-white/85 bg-white/75 p-4 shadow-[0_10px_24px_rgba(24,24,34,0.08)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white'>
            <div className='aspect-square overflow-hidden rounded-xl mb-3 bg-gradient-to-b from-[#fff8ef] to-[#f6f1ff]'>
                <img className='w-full h-full object-contain' src={image && image[0] ? image[0] : ''} alt={name} />
            </div>
            <div className='flex flex-col gap-2'>
                <h1 className='text-lg font-[Gambarino] text-neutral-900 truncate'>{name}</h1>
                <div className='flex justify-between items-center'>
                    <h1 className='text-xl font-[SourceSans] font-semibold text-neutral-900'>{price}{currency}</h1>
                    <button onClick={handleAddToCart} className='flex-shrink-0 text-xl text-neutral-700 group-hover:text-red-600 transition-colors'>
                        <i className="ri-heart-fill"></i>
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default ProductDisplay
