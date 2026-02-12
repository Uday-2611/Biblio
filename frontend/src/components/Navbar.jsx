import { useContext, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import Cart from './Cart'
import logo from '../assets/images/logo.png'

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { getCartCount } = useContext(ShopContext)
    const location = useLocation()

    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsCartOpen(false)
    }, [location.pathname])

    const navItems = [
        { label: 'HOME', to: '/home' },
        { label: 'SHOP', to: '/collection' },
        { label: 'PROFILE', to: '/profile' }
    ]

    const isActive = (path) => location.pathname.startsWith(path)

    return (
        <>
            <div className='w-full px-2 pt-2 md:px-6 md:pt-5'>
                <div className='mx-auto max-w-6xl rounded-[999px] border border-white/60 bg-white/35 px-4 py-3 shadow-[0_10px_35px_rgba(25,25,35,0.12)] backdrop-blur-xl md:px-7'>
                    <div className='flex items-center'>
                        <NavLink to='/home' className='flex items-center gap-2 md:flex-1 md:gap-3'>
                            <img src={logo} alt='Biblio logo' className='h-8 w-8 rounded-full object-cover md:h-10 md:w-10' />
                        </NavLink>

                        <div className='hidden md:flex md:flex-1 md:justify-center'>
                            <div className='flex gap-3 rounded-full p-1'>
                                {navItems.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={`rounded-lg px-4 py-2 text-[11px] font-semibold tracking-[0.2em] transition-all ${isActive(item.to) ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors duration-300 ease-out'
                                            }`}
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        <div className='hidden md:flex md:flex-1 md:justify-end'>
                            <div className='hidden items-center gap-2 lg:flex'>
                                <NavLink to='/sell' className='rounded-lg bg-white px-4 py-2 text-[11px] font-semibold tracking-[0.16em] text-neutral-700 transition-all hover:text-neutral-900'>
                                    LIST A BOOK
                                </NavLink>
                                <button type='button' onClick={() => setIsCartOpen(true)} className='relative rounded-full p-3 text-neutral-800 transition-colors hover:text-neutral-900'>
                                    <i className='ri-shopping-bag-2-line text-lg'></i>
                                    {getCartCount() > 0 && (
                                        <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white'>
                                            {getCartCount()}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className='ml-auto flex items-center gap-2 md:hidden'>
                            <button type='button' onClick={() => setIsCartOpen(true)} className='relative rounded-full bg-white/80 p-2 text-neutral-900'>
                                <i className='ri-shopping-bag-2-line text-xl'></i>
                                {getCartCount() > 0 && (
                                    <span className='absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-neutral-900 text-[9px] font-bold text-white'>
                                        {getCartCount()}
                                    </span>
                                )}
                            </button>
                            <button type='button' onClick={() => setIsMobileMenuOpen((prev) => !prev)} className='rounded-full bg-white/80 p-2 text-neutral-900'>
                                <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed left-0 right-0 top-24 z-40 px-3 transition-all duration-300 md:hidden ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'}`}>
                <div className='mx-auto max-w-md rounded-3xl border border-white/80 bg-gradient-to-b from-white to-[#f8f4ff] p-5 shadow-2xl'>
                    <div className='flex flex-col gap-2'>
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={`rounded-2xl px-4 py-3 text-center text-sm font-semibold tracking-[0.12em] ${isActive(item.to) ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-700'
                                    }`}
                            >
                                {item.label}
                            </NavLink>
                        ))}
                        <NavLink to='/sell' className='rounded-lg border border-neutral-300 px-4 py-3 text-center text-sm font-semibold tracking-[0.12em] text-neutral-800'>
                            LIST A BOOK
                        </NavLink>
                    </div>
                </div>
            </div>

            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default Navbar
