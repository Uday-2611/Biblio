import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductDisplay from '../components/ProductDisplay';
import SearchBar from '../components/SearchBar';

const Collection = () => {
  const { setShowSearch, fetchProducts } = useContext(ShopContext);
  const { products, search, showSearch, user } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Category, setCategory] = useState([])
  const [Condition, setCondition] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleCategory = (e) => {
    if (Category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleCondition = (e) => {
    if (Condition.includes(e.target.value)) {
      setCondition(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCondition(prev => [...prev, e.target.value])
    }
  }

  const applyFilter = () => {
    let productsCopy = products.slice();

    // Filter out current user's products by comparing with user._id from context
    if (user && user.id) {
      productsCopy = productsCopy.filter(item => item.sellerId !== user.id);
    }

    if(showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (Category.length > 0) {
      productsCopy = productsCopy.filter(item => Category.includes(item.Category));
    }

    if (Condition.length > 0) {
      productsCopy = productsCopy.filter(item => Condition.includes(item.Condition));
    }

    setFilterProducts(productsCopy);
  }

  const sortProducts = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => (a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => (b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }
  }

  useEffect(() => {
    applyFilter();
  }, [Category, Condition, search, showSearch, products])

  useEffect(() => {
    sortProducts();
  }, [sortType])

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    // Prevent scrolling when filter is open
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  return (
    <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] object-cover overflow-x-hidden m-auto bg-white min-h-screen'>
      <div className='mt-32 w-full px-10'>
        <div className='flex justify-between items-center'>
          <h1 className='font-[SourceSans] text-5xl'>Products</h1>
          
          <div className='flex items-center gap-4'>
            <button 
              onClick={() => setShowSearch(true)} 
              className='text-2xl hover:text-gray-600 transition-colors'
            >
              <i className="ri-search-line"></i>
            </button>
            
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)} 
              className='border-2 text-black px-6 py-2 border-neutral-300 rounded-full font-[SourceSans] text-sm hover:bg-neutral-100 transition-colors'
            >
              {isFilterOpen ? 'CLOSE FILTERS' : 'APPLY FILTERS'}
            </button>
            
            <select 
              onChange={(e) => setSortType(e.target.value)} 
              className='border-2 text-sm px-4 py-2 rounded-full bg-white'
            >
              <option value="relevant">Sort by Relevance</option>
              <option value="low-high">Sort by Low-High</option>
              <option value="high-low">Sort by High-Low</option>
            </select>
          </div>
        </div>
      </div>

      <SearchBar />

      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isFilterOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsFilterOpen(false)}
      />

      {/* Filter Sidebar */}
      <div className={`fixed right-0 top-0 h-screen w-[300px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isFilterOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='font-medium text-xl'>Filters</h1>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className='text-neutral-400 hover:text-neutral-600'
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* Category Filter */}
          <div className='mb-8'>
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value={'fiction'} onChange={toggleCategory} />
                Fiction
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value={'non-fiction'} onChange={toggleCategory} />
                Non-Fiction
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value={'academic'} onChange={toggleCategory} />
                Academic
              </label>
            </div>
          </div>

          {/* Condition */}
          <div className='mb-8'>
            <p className='mb-3 text-sm font-medium'>CONDITION</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value="new" onChange={toggleCondition} />
                New
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value="like-new" onChange={toggleCondition} />
                Like New
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value="good" onChange={toggleCondition} />
                Good
              </label>
              <label className='flex items-center gap-2 cursor-pointer'>
                <input className='w-4 h-4' type="checkbox" value="fair" onChange={toggleCondition} />
                Fair
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-8 py-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
          {loading ? (
            <div className='col-span-full text-center py-8'>Loading products...</div>
          ) : filterProducts.length === 0 ? (
            <div className='col-span-full text-center py-8'>No products found</div>
          ) : (
            filterProducts.map((item, index) => (
              <ProductDisplay 
                key={item._id || index}
                name={item.name} 
                price={item.price} 
                image={item.image} 
                id={item._id} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Collection
