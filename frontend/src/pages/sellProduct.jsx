import { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Button from '../components/common/Button';

const SellProduct = () => {
  const { backendUrl, token, navigate, requireAuth, fetchProducts } = useContext(ShopContext);
  const [newBook, setNewBook] = useState({
    name: '',
    author: '',
    description: '',
    Condition: 'new',
    Category: '',
    price: '',
    images: { image1: null, image2: null }
  });

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      if (!files[0].type.startsWith('image/')) {
        toast.error('Please upload only image files');
        return;
      }
      
      if (files[0].size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
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

  const removeImage = (imageName) => {
    setNewBook(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [imageName]: null,
        [`${imageName}Preview`]: null
      }
    }));
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

    const hasImages = Object.values(newBook.images).some(img => img !== null);
    if (!hasImages) {
      toast.error('Please upload at least one image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newBook.name);
      formData.append('author', newBook.author);
      formData.append('description', newBook.description);
      formData.append('Category', newBook.Category);
      formData.append('Condition', newBook.Condition);
      formData.append('price', newBook.price);
      formData.append('date', Date.now());

      Object.entries(newBook.images).forEach(([key, file]) => {
        if (file && !key.includes('Preview')) formData.append(key, file);
      });

      const response = await axios.post(backendUrl + '/api/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': token
        }
      });

      if (response.data.success) {
        await fetchProducts();
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

  return (
    <div className='p-4 sm:p-8 mt-20'>
      <div className='flex flex-col gap-6'>
        <h1 className='font-[Gambarino] text-3xl sm:text-4xl md:text-5xl text-center md:text-left text-neutral-900'>ADD NEW ITEM</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-6 max-w-2xl mx-auto md:mx-0'>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {[1, 2].map(num => (
              <div key={num} className='relative w-full aspect-square rounded-xl border border-white/90 flex items-center justify-center bg-white/80'>
                <input type="file" name={`image${num}`} accept="image/*" onChange={handleImageUpload} className='absolute inset-0 opacity-0 cursor-pointer'/>
                {newBook.images[`image${num}Preview`] ? (
                  <div className="relative w-full h-full">
                    <img src={newBook.images[`image${num}Preview`]} alt={`Preview ${num}`} className="w-full h-full object-cover rounded-xl"/>
                    <button type="button" onClick={() => removeImage(`image${num}`)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600">
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ) : (
                  <div className='flex flex-col items-center gap-2 text-neutral-400'>
                    <i className="ri-upload-cloud-2-line text-4xl"></i>
                    <span>Image {num}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className='space-y-6'>
            <div className='flex flex-col gap-2 text-black font-[SourceSans]'>
              <label>NAME</label>
              <input type="text" name="name" value={newBook.name} onChange={handleInputChange} className='bg-white/90 border border-white p-3 rounded-xl w-full' placeholder='Enter Book Name' required />
            </div>

            <div className='flex flex-col gap-2 text-black font-[SourceSans]'>
              <label>AUTHOR</label>
              <input type="text" name="author" value={newBook.author} onChange={handleInputChange} className='bg-white/90 border border-white p-3 rounded-xl w-full' required placeholder="Enter Author's Name" />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2 text-black font-[SourceSans]'>
                <label>CONDITION</label>
                <select name="Condition" value={newBook.Condition} onChange={handleInputChange} className='bg-white/90 border border-white p-3 rounded-xl w-full' required>
                  <option value="New">New</option>
                  <option value="Like-New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <div className='flex flex-col gap-2 text-black font-[SourceSans]'>
                <label>CATEGORY</label>
                <select name="Category" value={newBook.Category} onChange={handleInputChange} className='bg-white/90 border border-white p-3 rounded-xl w-full' required>
                  <option value="">Select Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-Fiction">Non-Fiction</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
            </div>

            <div className='flex flex-col gap-2 text-black font-[SourceSans]'>
              <label>DESCRIPTION</label>
              <textarea name="description" value={newBook.description} onChange={handleInputChange} className='bg-white/90 border border-white p-3 rounded-xl min-h-[120px] w-full resize-none' required />
            </div>

            <div className='flex flex-col gap-2 text-black font-[SourceSans]'>
              <label>PRICE</label>
              <input type="number" name="price" value={newBook.price} onChange={handleInputChange} className='bg-white/90 border border-white p-3 rounded-xl w-full' required />
            </div>

            <Button type="submit" variant="primary" className="w-full sm:w-auto" >
              ADD ITEM
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellProduct;
