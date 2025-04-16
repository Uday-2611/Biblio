import React, { useState, useEffect, useContext } from 'react'
import Sidebar from '../components/Sidebar'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const ListProduct = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/my-products`, {
        headers: { token }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  return (
    <div className='flex w-screen min-h-screen bg-white'>
      <Sidebar />
      <main className='flex-1 pl-64'>
        <div className='w-full max-w-[1200px] mx-auto px-6 py-8 pt-24'>
          <div className='flex justify-between items-center mb-8'>
            <h1 className='text-3xl font-[Editorial]'>My Sales History</h1>
            <Link 
              to="/sell"
              className='bg-[#22df04] text-white px-6 py-2 rounded-lg hover:bg-[#1ec703] transition-colors'
            >
              + Sell New Book
            </Link>
          </div>
          <div className='overflow-x-auto'>
            {loading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">No products listed yet</div>
            ) : (
              <table className='w-full'>
                <thead className='bg-neutral-50'>
                  <tr>
                    <th className='p-4 text-left'>Product</th>
                    <th className='p-4 text-left'>Price</th>
                    <th className='p-4 text-left'>Category</th>
                    <th className='p-4 text-left'>Condition</th>
                    <th className='p-4 text-left'>Listed Date</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id} className='border-b'>
                      <td className='p-4'>{product.name}</td>
                      <td className='p-4'>₹{product.price}</td>
                      <td className='p-4'>{product.Category}</td>
                      <td className='p-4'>{product.Condition}</td>
                      <td className='p-4'>{new Date(product.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default ListProduct

