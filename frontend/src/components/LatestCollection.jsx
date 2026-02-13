import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const LatestCollection = () => {
    const { products, user } = useContext(ShopContext);
    const [LatestCollection, setLatestCollection] = useState([]);
    const [activeCard, setActiveCard] = useState(null);
    const placeholderCards = [assets.imgHome1, assets.imgHome2, assets.imgHome3, assets.imgHome4];
    const cardDetails = [
        {
            heading: 'Curated Discovery Engine',
            subheading: 'Find overlooked titles through smart curation built for readers who want quality, not noise.'
        },
        {
            heading: 'Sell In Minutes',
            subheading: 'List your old books quickly, reach real buyers, and keep books in circulation instead of storage.'
        },
        {
            heading: 'Trusted Reader Network',
            subheading: 'Buy and sell with transparent listings, verified activity, and a community that values good books.'
        },
        {
            heading: 'Sustainable Reading Economy',
            subheading: 'Every resale extends a book\'s life, lowers waste, and makes reading more accessible across cities.'
        }
    ];

    useEffect(() => {
        if (products.length > 0) {
            let filteredProducts = products;
            if (user && user.id) {
                filteredProducts = products.filter(item => item.sellerId !== user.id);
            }
            setLatestCollection(filteredProducts.slice(0, 4));
        }
    }, [products, user])

    return (
        <div className='container mx-auto px-4 md:px-8'>
            <div className='flex justify-center gap-6 mb-10'>
                {placeholderCards.map((image, index) => {
                    const isActive = activeCard === index;

                    return (
                    <div
                        key={index}
                        onMouseEnter={() => setActiveCard(index)}
                        onMouseLeave={() => setActiveCard(null)}
                        className={`relative h-80 overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-[0_10px_24px_rgba(24,24,34,0.08)] transition-all duration-500 ease-out ${isActive ? 'w-[530px]' : 'w-64'}`}
                    >
                        <div className='absolute inset-0 flex'>
                            <div className='h-full w-64 flex-shrink-0'>
                                <img
                                    src={image}
                                    alt={`Book card ${index + 1}`}
                                    className='h-full w-full object-cover'
                                />
                            </div>

                            <div className={`relative h-full overflow-hidden bg-gradient-to-b from-white/90 to-[#f9f6f1]/95 transition-all duration-500 ease-out ${isActive ? 'w-[266px] opacity-100' : 'w-0 opacity-0'}`}>
                                <div className={`pointer-events-none absolute -right-8 top-10 h-24 w-24 rounded-full bg-[#f9b57e]/40 blur-2xl transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`pointer-events-none absolute bottom-12 right-6 h-16 w-16 rounded-full bg-[#d8d3ff]/30 blur-xl transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>
                                <div className={`absolute inset-0 flex h-full flex-col justify-end p-6 transition-all duration-300 ease-out ${isActive ? 'translate-y-0 opacity-100 delay-500' : 'translate-y-3 opacity-0 delay-0'}`}>
                                    <h3 className='font-[Gambarino] text-2xl leading-tight text-neutral-900'>
                                        {cardDetails[index].heading}
                                    </h3>
                                    <p className='mt-3 font-[SourceSans] text-sm leading-relaxed text-neutral-700'>
                                        {cardDetails[index].subheading}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
    )
}

export default LatestCollection
