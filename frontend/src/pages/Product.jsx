import React, { useContext, useEffect, useState } from 'react'
import UserReview from '../components/UserReview'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import RelatedProducts from '../components/RelatedProducts'
import { toast } from 'react-toastify'
import axios from 'axios'

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, user, requireAuth, token } = useContext(ShopContext);
  
  const [quantity, setQuantity] = useState(1);
  const [productData, setProductData] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrl = (imagePath) => {
    return `${backendUrl}/uploads/${imagePath}`;
  };

  const fetchProductData = async () => {
    products.map((item) => {
      if(item._id === productId) {
        setProductData(item);
        return null;
      }
    })
  }

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      if (response.data.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!requireAuth()) return;

    if (!newReview.trim()) {
      toast.error('Please write a review');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/review/add`, {
        productId,
        rating,
        review: newReview
      }, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Review added successfully');
        setNewReview('');
        setRating(5);
        await fetchReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/review/${reviewId}`, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Review deleted successfully');
        await fetchReviews();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const renderStars = () => {
    return (
      <div className='flex gap-2 mb-4'>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className='text-2xl'
          >
            <i className={`ri-star-${rating >= star ? 'fill' : 'line'} text-yellow-500`} />
          </button>
        ))}
      </div>
    );
  };

  return productData ? (
    <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] min-h-screen bg-white'>
      <div className='w-full flex flex-col gap-10 pt-32'>
        <div className='flex w-[90%] m-auto'>
          <div className='w-1/2 flex justify-center items-center'>
            <div className='w-[55%] h-[90%] rounded-xl overflow-hidden'>
              <img src={productData.image && productData.image[0] ? getImageUrl(productData.image[0]) : ''} className='w-full h-full object-cover' alt="Book Cover" />
            </div>
          </div>

          <div className='w-1/2 flex flex-col justify-center gap-4 font-[SourceSans]'>
            <h1 className='font-medium text-[4vw]'>{productData.name}</h1>
            <h2 className='font-medium text-[1.5vw] ml-5'>{productData.author}</h2>
            <h1 className='font-medium text-[2vw] ml-5'>{currency} {productData.price} </h1>
            <p className='m-5 text-neutral-600'>{productData.description}</p>

            <div className='flex flex-col m-5 gap-2'>
              <div className='flex justify-between gap-2'>
                <div className='p-4 border-2 border-neutral-200 text-center rounded-xl w-full'>
                  <h1 className='font-medium'>{productData.Category}</h1>
                </div>
                <div className='p-4 border-2 border-neutral-200 text-center rounded-xl w-full'>
                  <h1 className='font-medium'>{productData.Condition}</h1>
                </div>
              </div>

              <div className='flex justify-between gap-2'>
                <div className='p-4 border-2 border-neutral-200 text-center rounded-xl w-full flex items-center justify-between'>
                  <button
                    className='text-xl font-medium px-2'
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  >
                    <i className="ri-subtract-line"></i>
                  </button>
                  <span className='font-medium'>{quantity}</span>
                  <button
                    className='text-xl font-medium px-2'
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="ri-add-line"></i>
                  </button>
                </div>
                <button
                  onClick={() => addToCart(productData._id, quantity)}
                  className='bg-[#22df04] text-black p-4 rounded-xl font-[Monsterat] text-sm w-full'>
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ------ Review Section ------ */}
        <div className='flex w-[90%] m-auto gap-10 mb-20'>
          <div className='w-1/2'>
            <h1 className='text-[2vw] font-medium font-[SourceSans] mb-4'>Reviews</h1>
            <form onSubmit={handleSubmitReview} className='mt-2'>
              {renderStars()}
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className='border-2 w-full h-[20vh] rounded-xl border-neutral-200 p-4 font-[Monsterat] placeholder:text-neutral-400'
                placeholder={user ? 'Write a review' : 'Please login to write a review'}
                disabled={!user || isSubmitting}
              />
              <button
                type="submit"
                disabled={!user || isSubmitting}
                className='mt-4 bg-[#22df04] text-black px-6 py-2 rounded-lg font-[Monsterat] text-sm disabled:opacity-50'
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>

          <div className='w-1/2 flex flex-col gap-4'>
            {reviews.length === 0 ? (
              <p className='text-neutral-500 text-center py-8'>No reviews yet</p>
            ) : (
              reviews.map((review) => (
                <UserReview
                  key={review._id}
                  review={review}
                  onDelete={handleDeleteReview}
                  canDelete={user && user.id === review.userId._id}
                />
              ))
            )}
          </div>

          {/* ------ Related Products ------ */}
          <RelatedProducts Category={productData.Category} Condition={productData.Condition} />
        </div>
      </div>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
