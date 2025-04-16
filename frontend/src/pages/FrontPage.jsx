import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'


const FrontPage = () => {
    return (
        <div className='w-full h-screen flex justify-center items-center flex-col relative' style={{
            backgroundImage: `url(${assets.Background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <h1 className='text-white font-[Editorial] font-bold text-[10rem]'>
                Page Turner
            </h1>
            <div>
                <div className='absolute bottom-12 w-full flex justify-center left-0'>
                    <NavLink to='/login' className='p-3 bg-white rounded-md px-8 hover:bg-neutral-200 transition duration-200'>
                        <h1 className='font-[Monsterat] font-medium'>
                            SHOP NOW
                        </h1>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default FrontPage
