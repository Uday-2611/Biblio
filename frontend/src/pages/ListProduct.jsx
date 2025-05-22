import React, { useState, useEffect, useContext } from 'react'
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
    <div className='w-full min-h-screen'>
      <div className='w-[90%] m-auto pt-32'>
        <div className='flex justify-between items-center mb-8'>
          <h1 className='font-["Monsterat"] text-5xl font-medium'>SALES HISTORY</h1>
        </div>
        <div className='overflow-x-auto'>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">No products listed yet</div>
          ) : (
            <table className='w-full'>
              <thead className='bg-neutral-100'>
                <tr className='flex justify-between items-center'>
                  <th className='p-4 text-left w-[300px]'>PRODUCT</th>
                  <th className='p-4 text-left w-[100px]'>PRICE</th>
                  <th className='p-4 text-left w-[150px]'>CATEGORY</th>
                  <th className='p-4 text-left w-[150px]'>CONDITION</th>
                  <th className='p-4 text-left w-[150px]'>DATE</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className='border-b flex justify-between items-center'>
                    <td className='p-4 w-[300px]'>{product.name}</td>
                    <td className='p-4 w-[100px]'>${product.price}</td>
                    <td className='p-4 w-[150px]'>{product.Category}</td>
                    <td className='p-4 w-[150px]'>{product.Condition}</td>
                    <td className='p-4 w-[150px]'>{new Date(product.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListProduct

