import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const SearchBar = () => {
    const { setSearch, showSearch, setShowSearch } = useContext(ShopContext)

    return (
        <div className={`w-full fixed left-0 transition-all duration-300 ease-in-out ${showSearch ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
            }`} style={{ top: '128px', zIndex: 40 }}>
            <div className='mx-auto max-w-5xl rounded-2xl border border-white/80 bg-white/90 px-6 py-4 shadow-lg backdrop-blur-md'>
                <div className='relative font-[SourceSans]'>
                    <input type="text" placeholder="Search products..." onChange={(e) => setSearch(e.target.value)} className='w-full rounded-xl border border-white bg-white px-10 py-3 pr-11 text-neutral-800 outline-none transition-colors focus:border-neutral-300' />
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
                    <button onClick={() => setShowSearch(false)} className='absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700' >
                        <i className="ri-close-line text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SearchBar
