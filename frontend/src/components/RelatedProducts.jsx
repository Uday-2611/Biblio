import { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductDisplay from './ProductDisplay'

const RelatedProducts = ({ Category, Condition }) => {
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => Category === item.Category);

            productsCopy.sort((a, b) => {
                if (a.Category === b.Category) {
                    const currentName = productsCopy[0]?.name.toLowerCase() || '';
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();

                    const wordsA = nameA.split(' ');
                    const wordsB = nameB.split(' ');
                    const commonWordsA = wordsA.filter(word => currentName.includes(word)).length;
                    const commonWordsB = wordsB.filter(word => currentName.includes(word)).length;

                    return commonWordsB - commonWordsA;
                }
                return 0;
            });

            setRelated(productsCopy.slice(0, 4));
        }
    }, [products, Category, Condition])

    return (
        <div>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
                {related.map((item, index) => (
                    <ProductDisplay key={item._id || index} name={item.name} price={item.price} image={item.image} id={item._id} />
                ))}
            </div>
        </div>
    )
}

export default RelatedProducts
