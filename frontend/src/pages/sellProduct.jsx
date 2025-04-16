import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import Button from '../components/common/Button';

const Sell = () => {
  const { backendUrl, token, navigate, requireAuth, fetchProducts } = useContext(ShopContext);
  const [newBook, setNewBook] = useState({
    name: '',
    author: '',
    description: '',
    Condition: 'new',
    Category: '',  // Changed from genre to match backend
    price: '',
    images: {
      image1: null,
      image2: null,
      image3: null,
      image4: null
    }
  });

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      const imageUrl = URL.createObjectURL(files[0]);
      setNewBook(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [name]: files[0],
          [`${name}Preview`]: imageUrl
        }
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requireAuth()) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append('name', newBook.name);
      formData.append('author', newBook.author);  // Add author field
      formData.append('description', newBook.description);
      formData.append('Category', newBook.Category);
      formData.append('Condition', newBook.Condition);
      formData.append('price', newBook.price);
      formData.append('date', Date.now());  // Add date field required by backend
      
      // Append available images
      Object.entries(newBook.images).forEach(([key, file]) => {
        if (file && !key.includes('Preview')) formData.append(key, file);
      });

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': token  // Change this line
        }
      });

      if (response.data.success) {
        await fetchProducts(); // Add this line to refresh products
        toast.success('Product listed successfully!');
        navigate('/collection');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to list product');
    }
  };

  // Fix the price input section structure
  return (
    <div className='flex w-screen min-h-screen bg-white'>
      <Sidebar />
      <main className='flex-1 pl-64'>
        <div className='max-w-[1200px] w-full mx-auto px-6 py-8 pt-24'>
          <div className='flex flex-col gap-6'>
            <h1 className='font-["SourceSans"] text-4xl font-medium'>Add New Item</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-2xl'>
              <div className='grid grid-cols-2 gap-4'>
                {[1, 2, 3, 4].map(num => (
                  <div key={num} className='relative w-full aspect-square border-2 border-dashed rounded-xl flex items-center justify-center bg-neutral-50'>
                    <input 
                      type="file" 
                      name={`image${num}`}
                      accept="image/*"
                      onChange={handleImageUpload}
                      className='absolute inset-0 opacity-0 cursor-pointer'
                    />
                    {newBook.images[`image${num}Preview`] ? (
                      <img 
                        src={newBook.images[`image${num}Preview`]} 
                        alt={`Preview ${num}`} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className='flex flex-col items-center gap-2 text-neutral-400'>
                        <i className="ri-upload-cloud-2-line text-4xl"></i>
                        <span>Image {num}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
  
              <div className='flex flex-col gap-2'>
                <label className='text-neutral-500'>Book Name</label>
                <input 
                  type="text"
                  name="name"
                  value={newBook.name}
                  onChange={handleInputChange}
                  className='border p-2 rounded-lg'
                  required
                />
              </div>
  
              <div className='flex flex-col gap-2'>
                <label className='text-neutral-500'>Author's Name</label>
                <input 
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  className='border p-2 rounded-lg'
                  required
                />
              </div>
  
              <div className='flex gap-4'>
                <div className='flex flex-col gap-2 w-1/2'>
                  <label className='text-neutral-500'>Condition</label>
                  <select 
                    name="Condition"
                    value={newBook.Condition}
                    onChange={handleInputChange}
                    className='border p-2 rounded-lg'
                    required
                  >
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
  
                <div className='flex flex-col gap-2 w-1/2'>
                  <label className='text-neutral-500'>Category</label>
                  <select 
                    name="Category"
                    value={newBook.Category}
                    onChange={handleInputChange}
                    className='border p-2 rounded-lg'
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="fiction">Fiction</option>
                    <option value="non-fiction">Non-Fiction</option>
                    <option value="academic">Academic</option>
                  </select>
                </div>
              </div>
  
              <div className='flex flex-col gap-2'>
                <label className='text-neutral-500'>Description</label>
                <textarea 
                  name="description"
                  value={newBook.description}
                  onChange={handleInputChange}
                  className='border p-2 rounded-lg min-h-[100px]'
                  required
                />
              </div>
  
              <div className='flex flex-col gap-2'>
                <label className='text-neutral-500'>Price (₹)</label>
                <input 
                  type="number"
                  name="price"
                  value={newBook.price}
                  onChange={handleInputChange}
                  className='border p-2 rounded-lg'
                  required
                />
              </div>
  
              <Button 
                type="submit"
                variant="primary"
                className="mt-4"
              >
                ADD ITEM
              </Button>
            </form>
          </div>
          <hr className='my-8' />
        </div>
      </main>
    </div>
  );
};

export default Sell;
