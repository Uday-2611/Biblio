import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductDisplay from './ProductDisplay';

const RelatedProducts = ({ Category, Condition }) => {

    const {products} = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect (() => {
        if(products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => Category === item.Category);
            productsCopy = productsCopy.filter((item) => Condition === item.Condition);

            setRelated(productsCopy.slice(0,5));
        }
    },[products])

    return (
        <div className='my-24'>
            <div className='text-center text-3xl py-2'>
                <h1>Related Products</h1>
            </div>
            <div className='flex'>
                {related.map((item, index) => (
                    <ProductDisplay key={index} id={item._id} name = {item.name} price={item.price} image={item.image} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
