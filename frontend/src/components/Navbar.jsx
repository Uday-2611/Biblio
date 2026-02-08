import { useContext, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Cart from './Cart'
import logo from '../assets/images/logo.png'

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [activeItem, setActiveItem] = useState('home')
    const { getCartCount } = useContext(ShopContext);
    const location = useLocation();

    useEffect(() => {
        if (isCartOpen) {
            setIsCartOpen(false)
        }
        if (location.pathname.startsWith('/collection')) {
            setActiveItem('shop')
            return
        }
        if (location.pathname.startsWith('/profile')) {
            setActiveItem('profile')
            return
        }
        if (location.pathname.startsWith('/home') || location.pathname === '/') {
            setActiveItem('home')
        }
    }, [location.pathname])

    const navItems = [
        { key: 'home', label: 'HOME', to: '/home' },
        { key: 'shop', label: 'SHOP', to: '/collection' },
        { key: 'profile', label: 'PROFILE', to: '/profile' },
        { key: 'cart', label: 'CART', to: '/cart' }
    ]

    const activeIndex = navItems.findIndex((item) => item.key === activeItem)

    return (
        <>
            {/* Pill-shaped Navbar */}
            <div className='fixed top-0 left-0 right-0 z-50 flex justify-center items-center pt-2 md:pt-4 px-2'>
                <div className='w-full max-w-2xl bg-neutral-100 backdrop-blur-md rounded-full px-3 md:px-4 py-3'>
                    <div className='flex items-center justify-between'>
                        {/* Left: Logo */}
                        <NavLink to='/home' className="flex-shrink-0">
                            <img
                                src={logo}
                                alt="Biblio logo"
                                className="h-8 w-8 md:h-9 md:w-9 object-contain"
                            />
                        </NavLink>

                        {/* Middle: Navigation */}
                        <div className='hidden md:flex flex-1 justify-center'>
                            <div className='relative w-full max-w-lg rounded-full p-1'>
                                <div
                                    className='absolute top-0.5 bottom-0.5 w-1/4 rounded-full bg-red-600 transition-transform duration-300 ease-out'
                                    style={{ transform: `translateX(${Math.max(activeIndex, 0) * 100}%)` }}
                                ></div>
                                <div className='grid grid-cols-4 relative z-10'>
                                    {navItems.map((item) => (
                                        item.key === 'cart' ? (
                                            <button
                                                key={item.key}
                                                type="button"
                                                onClick={() => {
                                                    setActiveItem('cart')
                                                    setIsCartOpen(true)
                                                }}
                                                className={`relative py-1.5 text-[11px] lg:text-sm font-semibold tracking-wide rounded-full transition-colors ${activeItem === item.key ? 'text-white' : 'text-neutral-700 hover:text-red-600'}`}
                                            >
                                                {item.label}
                                                {getCartCount() > 0 && (
                                                    <span className={`absolute -top-1 right-6 h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center ${activeItem === item.key ? 'bg-white text-red-600' : 'bg-red-600 text-white'}`}>
                                                        {getCartCount()}
                                                    </span>
                                                )}
                                            </button>
                                        ) : (
                                            <NavLink
                                                key={item.key}
                                                to={item.to}
                                                onClick={() => {
                                                    setActiveItem(item.key)
                                                    setIsCartOpen(false)
                                                }}
                                                className={`py-1.5 text-[11px] lg:text-sm font-semibold tracking-wide text-center rounded-full transition-colors ${activeItem === item.key ? 'text-white' : 'text-neutral-700 hover:text-red-600'}`}
                                            >
                                                {item.label}
                                            </NavLink>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Controls */}
                        <div className='flex items-center gap-4 md:hidden'>
                            <button onClick={() => setIsCartOpen(true)} className='relative'>
                                <i className="ri-shopping-bag-2-line text-2xl text-neutral-800"></i>
                                {getCartCount() > 0 && (
                                    <div className='absolute -top-2 -right-2 bg-red-600 text-white w-5 h-5 flex justify-center items-center rounded-full text-xs font-bold'>
                                        {getCartCount()}
                                    </div>
                                )}
                            </button>
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className='text-2xl text-neutral-800'>
                                <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`fixed top-20 left-0 right-0 z-40 md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className='mx-4 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-2xl overflow-hidden shadow-xl'>
                    <div className='flex flex-col px-6 py-4 gap-4'>
                        <NavLink
                            to='/home'
                            className="text-lg font-medium text-neutral-800 hover:text-red-500 transition-colors py-2 border-b border-neutral-200"
                            onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCartOpen(false)
                            }}
                        >
                            HOME
                        </NavLink>
                        <NavLink
                            to='/collection'
                            className="text-lg font-medium text-neutral-800 hover:text-red-500 transition-colors py-2 border-b border-neutral-200"
                            onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCartOpen(false)
                            }}
                        >
                            SHOP
                        </NavLink>
                        <button
                            type="button"
                            className="text-lg font-medium text-neutral-800 hover:text-red-500 transition-colors py-2 border-b border-neutral-200 text-left"
                            onClick={() => {
                                setActiveItem('cart')
                                setIsCartOpen(true)
                                setIsMobileMenuOpen(false)
                            }}
                        >
                            CART
                        </button>
                        <NavLink
                            to='/profile'
                            className="text-lg font-medium text-neutral-800 hover:text-red-500 transition-colors py-2"
                            onClick={() => {
                                setIsMobileMenuOpen(false)
                                setIsCartOpen(false)
                            }}
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
