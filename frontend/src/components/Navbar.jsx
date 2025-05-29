import { useContext, useState } from 'react'
import Cart from './Cart'
import { NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { getCartCount } = useContext(ShopContext);

    return (
        <>
            <div className='fixed top-0 left-0 right-0 z-50 bg-[#111] text-white'>
                <div className='flex items-center justify-between px-4 py-3 md:py-4'>
                    {/* Logo */}
                    <NavLink to='/home'>
                        <h1 className='text-3xl md:text-[2vw] font-[EditorialLight] font-medium text-red-600 tracking-tight'>
                            Biblio
                        </h1>
                    </NavLink>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center gap-6'>
                        <NavLink to='/collection' className="relative group">
                            <h1 className='text-base lg:text-[1.2vw] hover:text-neutral-400'>SHOP</h1>
                        </NavLink>

                        <NavLink to='/profile' className="relative group">
                            <h1 className='text-base lg:text-[1.2vw] hover:text-neutral-400'>
                                <i className="ri-user-3-line"></i>
                            </h1>
                        </NavLink>

                        <button 
                            onClick={() => setIsCartOpen(true)} 
                            className='flex justify-center items-center gap-1 relative group'
                        >
                            <h1 className='text-base lg:text-[1.2vw] hover:text-neutral-400'>
                                <i className="ri-shopping-bag-2-line"></i>
                            </h1>
                            {getCartCount() > 0 && (
                                <div className='text-white w-4 h-4 flex justify-center items-center rounded-full absolute -top-2 -right-2'>
                                    <p className='text-xs lg:text-[0.8vw] font-[SourceSans]'>{getCartCount()}</p>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className='flex items-center gap-4 md:hidden'>
                        <button 
                            onClick={() => setIsCartOpen(true)} 
                            className='relative'
                        >
                            <i className="ri-shopping-bag-2-line text-2xl"></i>
                            {getCartCount() > 0 && (
                                <div className='absolute -top-2 -right-2 text-xs font-[SourceSans]'>
                                    {getCartCount()}
                                </div>
                            )}
                        </button>
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className='text-2xl'
                        >
                            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line`}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-40' : 'max-h-0'}`}>
                    <div className='flex flex-col bg-[#111] px-4 pb-4 gap-4'>
                        <NavLink 
                            to='/collection' 
                            className="text-lg hover:text-neutral-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            SHOP
                        </NavLink>
                        <NavLink 
                            to='/profile' 
                            className="text-lg hover:text-neutral-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            PROFILE
                        </NavLink>
                    </div>
                </div>
            </div>

            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default Navbar