import React, {useContext, useEffect, useState} from 'react'
import { ShopContext } from '../context/ShopContext';
import ProductDisplay from './ProductDisplay';

const LatestCollection = () => {
    const { products, user } = useContext(ShopContext);
    const [LatestCollection, setLatestCollection] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            // Filter out user's own products first
            let filteredProducts = products;
            if (user && user.id) {
                filteredProducts = products.filter(item => item.sellerId !== user.id);
            }
            // Then take the first 4 products
            setLatestCollection(filteredProducts.slice(0, 4));
        }
    }, [products, user])

    return (
        <div className='w-full flex object-center'>
            {/* Rendering Products */}
            {
                LatestCollection.map((item, index) => (
                    <ProductDisplay key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))
            }
        </div>
    )
}

export default LatestCollection
