import React, { useContext } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Collection from './pages/Collection'
import Product from './pages/Product'
import Profile from './pages/Profile'
import PlaceOrder from './pages/PlaceOrder'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import 'remixicon/fonts/remixicon.css'
import FrontPage from './pages/FrontPage'
import './styles/fonts.css'
import Sell from './pages/Sell'
import AllOrders from './pages/AllOrders'
import ListProduct from './pages/ListProduct'
import AdminOrders from './pages/AdminOrders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ShopContext } from './context/ShopContext'

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(ShopContext);
  const location = useLocation();
  
  if (!token) {
    // Save the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
};

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/Signup', '/', '/place-order'];
  const isHiddenPath = hideNavbarPaths.includes(location.pathname);

  return (
    <div className={`${isHiddenPath ? 'w-full' : 'px-4 sm:px-[5vw] md:px-[7vw] lg:px-[2vw]'} relative h-full`}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          width: 'auto',
          maxWidth: '400px'
        }}
        toastStyle={{
          background: 'white',
          color: 'black'
        }}
      />
      {!isHiddenPath && <div className="fixed top-0 left-0 right-0 z-50"><Navbar /></div>}
      
      <Routes>
        <Route path='/' element={<FrontPage />} />
        <Route path='/login' element={<Login />} />
        
        {/* Protected Routes */}
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/collection' element={<ProtectedRoute><Collection /></ProtectedRoute>} />
        <Route path='/product/:productId' element={<ProtectedRoute><Product /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/place-order' element={<ProtectedRoute><PlaceOrder /></ProtectedRoute>} />
        <Route path='/all-orders' element={<ProtectedRoute><AllOrders /></ProtectedRoute>} />
        <Route path='/sell/*' element={<ProtectedRoute><Sell /></ProtectedRoute>} />
        <Route path='/list-product' element={<ProtectedRoute><ListProduct /></ProtectedRoute>} />
        <Route path='/admin-orders' element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
      </Routes>
      
      {!isHiddenPath && <Footer />}
    </div>
  )
}

export default App
