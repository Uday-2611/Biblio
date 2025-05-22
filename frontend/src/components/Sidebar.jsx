import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='left-0 top-0 h-screen w-[30vw]  bg-white'>
      <div className='p-8 mt-20'>
        <div className='flex flex-col gap-4 font-[Monsterat] uppercase text-xl'>
          <NavLink to='/sell' end className={({ isActive }) => `flex items-center gap-3 p-3 transition-all ${isActive ? 'font-semibold' : 'hover:scale-105'}`}>
            <i className="ri-store-line"></i>
            Sell Books
          </NavLink>
          <NavLink to='/sell/list-products' className={({ isActive }) => `flex items-center gap-3 p-3 transition-all ${isActive ? 'font-semibold' : 'hover:scale-105'}`} >
            <i className="ri-history-line"></i>
            Sales History
          </NavLink>
          <NavLink to='/sell/orders' className={({ isActive }) => `flex items-center gap-3 p-3 transition-all ${isActive ? 'font-semibold' : 'hover:scale-105'}`} >
            <i className="ri-shopping-bag-line"></i>
            Orders
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
