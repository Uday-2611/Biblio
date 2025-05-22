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
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [tempCategory, setTempCategory] = useState([]);
  const [tempCondition, setTempCondition] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const filterSidebarRef = useRef(null);

  // Category ->
  const toggleCategory = (e) => {
    if (tempCategory.includes(e.target.value)) {
      setTempCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setTempCategory(prev => [...prev, e.target.value])
    }
  }

  // Condition ->
  const toggleCondition = (e) => {
    if (tempCondition.includes(e.target.value)) {
      setTempCondition(prev => prev.filter(item => item !== e.target.value))
    } else {
      setTempCondition(prev => [...prev, e.target.value])
    }
  }

  // Search ->
  const handleSearch = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    setShowSearch(true);
    // Update the search in the context
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

  // Applying filters -> 
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

    // Applying sorting ------>
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
    <div className=''>
      <div className='mt-32 w-full'>
        <div className='flex justify-between items-center'>
          <h1 className='font-[Monsterat] text-white uppercase font-medium text-5xl'>VIEW ALL</h1>

          <div className='flex items-center'>

            {/* SEARCH BAR -> */}
            <div className={`relative transition-all duration-300 ease-in-out ${ showSearch ? 'w-64 opacity-100' : 'w-0 opacity-0' }`}>

              <input ref={searchInputRef} type="text" value={localSearch} onChange={handleSearch} placeholder="Search products..." className="w-full bg-transparent border-b border-white text-white placeholder-gray-400 focus:outline-none focus:border-neutral-300 transition-colors duration-200 py-2" />
              
              <button onClick={handleSearchClose} className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300" aria-label="Close search" >
                <i className="ri-close-line"></i>
              </button>
            </div>

            <button onClick={() => setShowSearch(true)} className={`text-white hover:text-neutral-300 transition-opacity duration-300 ${ showSearch ? 'opacity-0 pointer-events-none' : 'opacity-100' }`} aria-label="Search" >
              <i className="ri-search-line"></i>
            </button>

            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className='text-white px-6 py-2 font-[Monsterat] hover:text-neutral-300' aria-label="Open filters" >
              FILTER
            </button>

            {/* DROPDOWN -> */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="font-[Monsterat] text-white hover:text-neutral-300 flex items-center gap-2" aria-label="Sort options" aria-expanded={isDropdownOpen} >
                {sortType === 'relevant' ? 'SORT' : sortType === 'low-high' ? 'LOW-HIGH' : sortType === 'high-low' ? 'HIGH-LOW' : 'SORT'}
                <i className={`ri-arrow-down-s-line transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
              </button>

              <div className={`absolute right-0 mt-2 w-48 bg-white shadow-lg transform transition-all duration-300 origin-top-right ${isDropdownOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`} role="menu" aria-orientation="vertical" aria-labelledby="sort-menu" >
                <ul className="py-2">
                  <li key="relevant">
                    <button onClick={() => handleSortChange('relevant')} className="w-full px-4 py-3 text-left text-black  hover:text-neutral-600 flex items-center gap-3" role="menuitem" >
                      <span className={`w-4 h-4 border-2 border-black rounded-full ${sortType === 'relevant' ? 'bg-black' : ''}`}></span>
                      RELEVANT
                    </button>
                  </li>
                  <li key="low-high">
                    <button onClick={() => handleSortChange('low-high')} className="w-full px-4 py-3 text-left text-black  hover:text-neutral-600 flex items-center gap-3" role="menuitem" >
                      <span className={`w-4 h-4 border-2 border-black rounded-full ${sortType === 'low-high' ? 'bg-black' : ''}`}></span>
                      LOW-HIGH
                    </button>
                  </li>
                  <li key="high-low">
                    <button onClick={() => handleSortChange('high-low')} className="w-full px-4 py-3 text-left text-black  hover:text-neutral-600 flex items-center gap-3" role="menuitem" >
                      <span className={`w-4 h-4 border-2 border-black rounded-full ${sortType === 'high-low' ? 'bg-black' : ''}`}></span>
                      HIGH-LOW
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY -> */}
      <div className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isFilterOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsFilterOpen(false)} aria-hidden="true" />

      {/* FILTER SIDEBAR -> */}
      <div ref={filterSidebarRef} className={`fixed right-0 top-0 h-screen w-[30vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} >
        <div className='p-6 h-full flex flex-col'>
          <div className='flex relative items-center mb-6'>
            <h1 className='w-[100%] text-center font-[Monsterat]'>FILTERS</h1>
            <button onClick={() => setIsFilterOpen(false)} className='hover:text-neutral-600 absolute right-0' aria-label="Close filters" >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>

          {/* CATEGORY -> */}
          <div className='mb-8 font-[Monsterat] mt-10'>
            <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className='flex justify-between items-center w-full mb-3 text-xl font-medium' aria-expanded={isCategoryOpen} >
              <span>CATEGORIES</span>
              <i className={`ri-arrow-down-s-line transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isCategoryOpen ? 'max-h-48' : 'max-h-0'}`}>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value={'fiction'} onChange={toggleCategory} checked={tempCategory.includes('fiction')} aria-label="Fiction category" />
                  Fiction
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value={'non-fiction'} onChange={toggleCategory} checked={tempCategory.includes('non-fiction')} aria-label="Non-fiction category" />
                  Non-Fiction
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value={'academic'} onChange={toggleCategory} checked={tempCategory.includes('academic')} aria-label="Academic category" />
                  Academic
                </label>
              </div>
            </div>
          </div>

          {/* CONDITION -> */}
          <div className='mb-8 font-[Monsterat]'>
            <button onClick={() => setIsConditionOpen(!isConditionOpen)} className='flex justify-between items-center w-full mb-3 text-xl font-medium' aria-expanded={isConditionOpen} >
              <span>CONDITION</span>
              <i className={`ri-arrow-down-s-line transition-transform duration-300 ${isConditionOpen ? 'rotate-180' : ''}`}></i>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isConditionOpen ? 'max-h-48' : 'max-h-0'}`}>
              <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value="new" onChange={toggleCondition} checked={tempCondition.includes('new')} aria-label="New condition" />
                  New
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value="like-new" onChange={toggleCondition} checked={tempCondition.includes('like-new')} aria-label="Like new condition" />
                  Like New
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value="good" onChange={toggleCondition} checked={tempCondition.includes('good')} aria-label="Good condition" />
                  Good
                </label>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input className='w-4 h-4' type="checkbox" value="fair" onChange={toggleCondition} checked={tempCondition.includes('fair')} aria-label="Fair condition" />
                  Fair
                </label>
              </div>
            </div>
          </div>

          {/* APPLY & CLEAR -> */}
          <div className='mt-auto flex gap-4 font-[Monsterat]'>
            <button onClick={handleClearFilters} className='flex-1 py-3 border text-black bg-white hover:bg-gray-100 transition-colors duration-200' aria-label="Clear all filters" >
              CLEAR
            </button>
            <button onClick={handleApplyFilters} className='flex-1 py-3 bg-black text-white hover:bg-neutral-800 transition-colors duration-200' aria-label="Apply filters" >
              APPLY
            </button>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-8 py-8'>
        {loading ? (
          <div className='text-center py-8 text-white'>Loading products...</div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8'>
            {filterProducts.length === 0 ? (
              <div className='col-span-full text-center py-8 text-white'>No products found</div>
            ) : (
              filterProducts.map((item, index) => (
                <ProductDisplay key={item._id || index} name={item.name} price={item.price} image={item.image} id={item._id} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Collection
