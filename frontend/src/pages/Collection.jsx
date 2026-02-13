import { useEffect, useState, useRef } from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductDisplay from '../components/ProductDisplay';

const Collection = () => {
  const { setShowSearch, fetchProducts, products, showSearch, user } = useContext(ShopContext);
  const [localSearch, setLocalSearch] = useState('');
  const searchInputRef = useRef(null);

  const [filterProducts, setFilterProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Category, setCategory] = useState([])
  const [Condition, setCondition] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState([]);
  const [tempCondition, setTempCondition] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const filterSidebarRef = useRef(null);

  const toggleCategory = (e) => {
    if (tempCategory.includes(e.target.value)) {
      setTempCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setTempCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleCondition = (e) => {
    if (tempCondition.includes(e.target.value)) {
      setTempCondition(prev => prev.filter(item => item !== e.target.value))
    } else {
      setTempCondition(prev => [...prev, e.target.value])
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setShowSearch(true);
    if (value.trim() === '') {
      setShowSearch(false);
    }
  }

  const handleSearchClose = () => {
    setLocalSearch('');
    setShowSearch(false);
  }

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const applyFilter = () => {
    let productsCopy = [...products];

    if (user && user.id) {
      productsCopy = productsCopy.filter(item => item.sellerId !== user.id);
    }
    if (showSearch && localSearch) {
      productsCopy = productsCopy.filter(item =>
        item.name.toLowerCase().includes(localSearch.toLowerCase())
      );
    }
    if (Category.length > 0) {
      productsCopy = productsCopy.filter(item => Category.includes(item.Category));
    }
    if (Condition.length > 0) {
      productsCopy = productsCopy.filter(item => Condition.includes(item.Condition));
    }

    if (sortType === 'low-high') {
      productsCopy.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortType === 'high-low') {
      productsCopy.sort((a, b) => Number(b.price) - Number(a.price));
    }

    setFilterProducts(productsCopy);
  }

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);
    setIsDropdownOpen(false);
  }

  const handleApplyFilters = () => {
    setCategory(tempCategory);
    setCondition(tempCondition);
    setIsFilterOpen(false);
  }

  const handleClearFilters = () => {
    setTempCategory([]);
    setTempCondition([]);
    setCategory([]);
    setCondition([]);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterSidebarRef.current && !filterSidebarRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    applyFilter();
  }, [Category, Condition, localSearch, showSearch, products, sortType])

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      await fetchProducts();
      setLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isFilterOpen]);

  return (
    <div className='app-page'>
      <div className='app-page-content app-surface p-4 sm:p-6 md:p-8'>

        <div className='w-full md:w-[95%] m-auto flex flex-col sm:flex-row justify-between items-center gap-4 py-20 md:py-24'>
          <h1 className='font-[Gambarino] text-3xl md:text-5xl text-center sm:text-left text-neutral-900'>VIEW ALL</h1>

          <div className='flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto'>

            <div className={`relative transition-all duration-300 ease-in-out w-full sm:w-auto ${showSearch ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
              <input ref={searchInputRef} type="text" value={localSearch} onChange={handleSearch} placeholder="Search products..." className="w-full sm:w-64 bg-transparent border-b border-neutral-700 text-neutral-800 placeholder-neutral-500 focus:outline-none focus:border-neutral-900 transition-colors duration-200 py-2" />

              <button onClick={handleSearchClose} className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-700 hover:text-neutral-900 sm:hidden" aria-label="Close search" >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <div className='relative'>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='flex items-center gap-2 text-neutral-800 px-4 py-2 hover:text-red-600 transition-colors'>
                <span>SORT BY</span>
                <i className={`ri-arrow-down-s-line transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              <div className={`absolute right-0 mt-2 w-48 rounded-xl border border-white/80 bg-white/95 shadow-lg transform transition-all duration-300 origin-top-right z-20 ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                <ul className="py-2">
                  {['relevant', 'low-high', 'high-low'].map((type) => (
                    <li key={type}>
                      <button onClick={() => handleSortChange(type)} className="w-full px-4 py-3 text-left text-neutral-800 hover:text-red-600 flex items-center gap-3">
                        <span className={`w-4 h-4 border-2 border-neutral-700 rounded-full ${sortType === type ? 'bg-neutral-800' : ''}`}></span>
                        {type === 'relevant' ? 'RELEVANT' : type === 'low-high' ? 'LOW-HIGH' : 'HIGH-LOW'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button onClick={() => setIsFilterOpen(true)} className='flex items-center gap-2 text-neutral-800 px-4 py-2 hover:text-red-600 transition-colors' >
              <span>FILTER</span>
              <i className="ri-filter-3-line"></i>
            </button>
          </div>
        </div>

        <div className='w-full md:w-[95%] m-auto mb-20'>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
            {filterProducts.length === 0 ? (
              <div className='col-span-full text-center py-8 text-neutral-700'>No products found</div>
            ) : (
              filterProducts.map((item, index) => (
                <ProductDisplay key={item._id || index} name={item.name} price={item.price} image={item.image} id={item._id} />
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isFilterOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsFilterOpen(false)} />

      <div className={`fixed right-0 top-0 h-screen w-full sm:w-[400px] md:w-[30vw] bg-white/95 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} >
        <div className='p-6 h-full flex flex-col overflow-y-auto'>
          <div className='flex justify-between items-center mb-6'>
            <h1 className='text-2xl font-[Gambarino] text-neutral-900'>FILTERS</h1>
            <button onClick={() => setIsFilterOpen(false)} className='text-2xl hover:text-neutral-600'>
              <i className="ri-close-line"></i>
            </button>
          </div>

          <div className='flex flex-col gap-8'>
            <div>
              <h2 className='font-[Gambarino] text-lg mb-4 text-neutral-900'>CATEGORY</h2>
              {['Fiction', 'Non-Fiction', 'Educational', 'Comics'].map((category) => (
                <label key={category} className='flex items-center gap-3 mb-3 cursor-pointer'>
                  <input type='checkbox' checked={tempCategory.includes(category)} onChange={() => toggleCategory({ target: { value: category } })} className='w-4 h-4' />
                  <span>{category}</span>
                </label>
              ))}
            </div>

            <div>
              <h2 className='font-[Gambarino] text-lg mb-4 text-neutral-900'>CONDITION</h2>
              {['New', 'Like New', 'Very Good', 'Good', 'Acceptable'].map((condition) => (
                <label key={condition} className='flex items-center gap-3 mb-3 cursor-pointer'>
                  <input type='checkbox' checked={tempCondition.includes(condition)} onChange={() => toggleCondition({ target: { value: condition } })} className='w-4 h-4' />
                  <span>{condition}</span>
                </label>
              ))}
            </div>

            <div className='mt-auto flex gap-4 font-[SourceSans]'>
              <button onClick={handleClearFilters} className='flex-1 py-3 border text-black bg-white hover:bg-gray-100 transition-colors duration-200' aria-label="Clear all filters" >
                CLEAR
              </button>
              <button onClick={handleApplyFilters} className='flex-1 py-3 bg-black text-white hover:bg-neutral-800 transition-colors duration-200' aria-label="Apply filters" >
                APPLY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection
