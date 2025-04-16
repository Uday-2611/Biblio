import React, { useContext, useState } from 'react'
import Cart from './Cart'
import { NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
    const [isCartOpen, setIsCartOpen] = useState(false)

    const { getCartCount } = useContext(ShopContext);

    return (
        <>
            <div className='flex px-6 py-3 w-[40%] m-auto justify-evenly items-center rounded-b-3xl bg-black/5 backdrop-blur-md backdrop-brightness-110 shadow-lg'>
                <NavLink to='/'>
                    <h1 className='text-[1.7vw] font-[EditorialLight]'>Page Turner</h1>
                </NavLink>

                <NavLink to='/home'>
                    <h1 className='text-[1.2vw]'>HOME</h1>
                </NavLink>

                <NavLink to='/collection'>
                    <h1 className='text-[1.2vw]'>SHOP ALL</h1>
                </NavLink>

                <NavLink to='/profile'>
                    <h1 className='text-[1.2vw]'>PROFILE</h1>
                </NavLink>

                <button onClick={() => setIsCartOpen(true)} className='flex justify-center items-center gap-1'>
                    <h1 className='text-[1.2vw]'>BAG</h1>
                    <div className='bg-black text-white w-5 h-5 flex justify-center items-center'>
                        <p className='font-[SourceSans]'> {getCartCount()} </p>
                    </div>
                </button>
            </div>

            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    )
}

export default Navbar