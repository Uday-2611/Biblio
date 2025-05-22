import { useContext, useState } from 'react'
import Cart from './Cart'
import { NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const { getCartCount } = useContext(ShopContext);

    return (
        <>
            <div className='flex p-4 w-[100%] m-auto justify-between items-center bg-[#111] text-white'>
                <div>
                    <NavLink to='/home'>
                        <h1 className='text-[2vw] font-[EditorialLight] font-medium text-red-600 tracking-tight ml-4'>Page Turner</h1>
                    </NavLink>
                </div>

                <div className='flex h-[100%] gap-6 mr-4'>
                    <NavLink to='/collection' className="relative group">
                        <h1 className='text-[1.2vw] hover:text-neutral-400'>SHOP</h1>
                    </NavLink>

                    <NavLink to='/profile' className="relative group">
                        <h1 className='text-[1.2vw] hover:text-neutral-400'><i className="ri-user-3-line"></i></h1>
                    </NavLink>

                    <button onClick={() => setIsCartOpen(true)} className='flex justify-center items-center gap-1 relative group'>
                        <h1 className='text-[1.2vw] hover:text-neutral-400'><i className="ri-shopping-bag-2-line"></i></h1>
                        {getCartCount() > 0 && (
                            <div className='text-white w-4 h-4 flex justify-center items-center rounded-full absolute top-6 right-[10%]'>
                                <p className='text-[0.8vw] font-[SourceSans]'>{getCartCount()}</p>
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default Navbar