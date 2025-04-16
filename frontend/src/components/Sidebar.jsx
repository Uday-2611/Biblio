import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='fixed left-0 top-0 h-screen w-64 bg-white shadow-lg p-6 z-30'>
      <div className='mt-20'>
        <h2 className='text-2xl font-[Editorial] mb-6'>Seller Dashboard</h2>
        <div className='flex flex-col gap-4'>
          <NavLink 
            to='/sell'
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-[#22df04] text-white border-b-2 border-[#1ec703]' : 'hover:bg-neutral-100'
              }`
            }
          >
            <i className="ri-store-line"></i>
            Sell Books
          </NavLink>
          <NavLink 
            to='/list-product'
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-[#22df04] text-white border-b-2 border-[#1ec703]' : 'hover:bg-neutral-100'
              }`
            }
          >
            <i className="ri-history-line"></i>
            Sales History
          </NavLink>
          <NavLink 
            to='/admin-orders'
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-lg transition-all ${
                isActive ? 'bg-[#22df04] text-white border-b-2 border-[#1ec703]' : 'hover:bg-neutral-100'
              }`
            }
          >
            <i className="ri-shopping-bag-line"></i>
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
