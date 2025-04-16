import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const SearchBar = () => {
    const { setSearch, showSearch, setShowSearch } = useContext(ShopContext)

    return (
        <div className={`w-full fixed left-0 bg-white transition-all duration-300 ease-in-out ${
            showSearch ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`} style={{ top: '128px', zIndex: 40 }}>
            <div className='container mx-auto px-10 py-4 border-b'>
                <div className='relative'>
                    <input
                        type="text"
                        placeholder="Search products..."
                        onChange={(e) => setSearch(e.target.value)}
                        className='w-full py-2 pl-10 pr-4 border-b-2 border-gray-300 focus:border-black outline-none transition-colors'
                    />
                    <i className="ri-search-line absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <button 
                        onClick={() => setShowSearch(false)}
                        className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar
