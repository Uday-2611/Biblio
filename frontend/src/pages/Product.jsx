import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import UserReview from '../components/UserReview'
import RelatedProducts from '../components/RelatedProducts'

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, backendUrl, user, requireAuth, token } = useContext(ShopContext);

  const [quantity] = useState(1);
  const [productData, setProductData] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
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

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = `${productData.name} by ${productData.author}`;
    const shareText = `Check out ${productData.name} by ${productData.author} on Biblio!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        setShowShareOptions(true);
      }
    } else {
      setShowShareOptions(true);
    }
  };

  const shareToWhatsApp = () => {
    const text = `Check out ${productData.name} by ${productData.author} on Biblio! ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    setShowShareOptions(false);
  };

  const shareToInstagram = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied! You can now paste it in your Instagram story');
    setShowShareOptions(false);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
    setShowShareOptions(false);
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
          <button key={star} type="button" onClick={() => setRating(star)} className='text-2xl' >
            <i className={`ri-star-${rating >= star ? 'fill' : 'line'} text-yellow-500`} />
          </button>
        ))}
      </div>
    );
  };

  return productData ? (
    <div className='w-[calc(100%+4vw)] -mx-4 sm:w-[calc(100%+10vw)] sm:-mx-[5vw] md:w-[calc(100%+14vw)] md:-mx-[7vw] lg:w-[calc(100%+4vw)] lg:-mx-[2vw] min-h-screen'>
      <div className='w-full flex flex-col gap-8 md:gap-10 pt-24 md:pt-32'>
        <div className='flex flex-col md:flex-row w-[95%] md:w-[90%] m-auto'>

          <div className='w-full md:w-1/2'>
            <div className='w-full md:w-[80%] h-[400px] md:h-[600px] overflow-hidden flex flex-col-reverse md:flex-row gap-4'>

              <div className='flex flex-row md:flex-col h-[100px] md:h-full w-full md:w-[25%] gap-4'>
                {[0, 1].map((index) => (
                  <div key={index} className={`w-1/2 md:w-auto md:h-[calc(50%-8px)] cursor-pointer ${selectedImage === index ? '' : 'opacity-70 hover:opacity-100'
                    }`} onClick={() => setSelectedImage(index)} >
                    {productData.image && productData.image[index] && (
                      <img src={productData.image[index]} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain" />
                    )}
                  </div>
                ))}
              </div>

              <div className='w-full md:w-[75%] h-[300px] md:h-full overflow-hidden'>
                <img src={productData.image && productData.image[selectedImage] ? productData.image[selectedImage] : ''} className='w-full h-full object-contain' alt="Book Cover" />
              </div>
            </div>
          </div>

          <div className='w-full md:w-1/2 flex flex-col gap-4 text-white p-4 md:p-0 mt-8 md:mt-0'>
            <div className='flex flex-col gap-2'>
              <h1 className='font-[Monsterat] uppercase text-2xl sm:text-3xl md:text-[3vw]'>{productData.name}</h1>
              <h2 className='font-medium text-xl sm:text-2xl md:text-[1.5vw]'>{productData.author}</h2>
              <h1 className='font-medium text-2xl sm:text-3xl md:text-[2vw]'>{currency} {productData.price}</h1>
            </div>

            <p className='text-base sm:text-lg md:text-[1vw] tracking-tight'>{productData.description}</p>

            <div className='flex flex-col gap-2 w-full md:w-[70%] mt-4'>
              <div className='py-4 border-b border-neutral-400'>
                <h1 className='uppercase text-base md:text-lg'>{productData.Category}</h1>
              </div>
              <div className='py-4 border-b border-neutral-400'>
                <h1 className='uppercase text-base md:text-lg'>{productData.Condition}</h1>
              </div>

              <div className='flex flex-col sm:flex-row gap-4 mt-4'>
                <button onClick={() => addToCart(productData._id, quantity)} className='bg-white text-black p-4 font-[Monsterat] w-full hover:bg-neutral-300' >
                  ADD TO CART
                </button>
                <button onClick={handleShare} className='bg-white text-black p-4 font-[Monsterat] w-full sm:w-auto sm:aspect-square hover:bg-neutral-300' title="Share" >
                  <i className="ri-share-line text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='w-[90%] m-auto mb-20'>
          <h1 className='text-2xl sm:text-3xl md:text-[2.5vw] font-[Monsterat] mb-8 text-white'>REVIEWS</h1>

          <div className='flex flex-col md:flex-row gap-8 md:gap-10'>
            <div className='w-full md:w-1/2'>
              <form onSubmit={handleSubmitReview} className='mt-2'>
                {renderStars()}
                <textarea value={newReview} onChange={(e) => setNewReview(e.target.value)} className='w-full h-[20vh] rounded-sm bg-neutral-900 p-4 font-[Monsterat] placeholder:text-neutral-400' placeholder={user ? 'Write a review......' : 'Please login to write a review'} disabled={!user || isSubmitting} />
                <button type="submit" disabled={!user || isSubmitting} className='mt-4 w-full sm:w-auto bg-white text-black px-6 py-2 uppercase font-[Monsterat] text-sm disabled:opacity-50' >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </div>

            <div className='w-full md:w-1/2 flex flex-col gap-4'>
              {reviews.length === 0 ? (
                <p className='text-neutral-500 text-center py-8'>No reviews yet</p>
              ) : (
                reviews.map((review) => (
                  <UserReview key={review._id} review={review} onDelete={handleDeleteReview} canDelete={user && user.id === review.userId._id} />
                ))
              )}
            </div>
          </div>

          <div className='mt-20'>
            <h2 className='text-xl sm:text-2xl md:text-3xl font-[Monsterat] mb-8 text-white'>RELATED PRODUCTS</h2>
            <RelatedProducts Category={productData.Category} Condition={productData.Condition} />
          </div>
        </div>

        {showShareOptions && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div className='bg-neutral-900 p-6 rounded-lg w-full max-w-sm'>
              <div className='flex justify-between items-center mb-4'>
                <h2 className='text-white text-xl font-[Monsterat]'>Share Product</h2>
                <button onClick={() => setShowShareOptions(false)} className='text-white hover:text-neutral-400' >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>
              <div className='flex flex-col gap-3'>
                <button onClick={shareToWhatsApp} className='flex items-center gap-3 text-white p-3 hover:bg-neutral-800 rounded-lg transition-colors' >
                  <i className="ri-whatsapp-line text-2xl text-green-500"></i>
                  <span>Share on WhatsApp</span>
                </button>
                <button onClick={shareToInstagram} className='flex items-center gap-3 text-white p-3 hover:bg-neutral-800 rounded-lg transition-colors' >
                  <i className="ri-instagram-line text-2xl text-pink-500"></i>
                  <span>Share on Instagram</span>
                </button>
                <button onClick={copyLink} className='flex items-center gap-3 text-white p-3 hover:bg-neutral-800 rounded-lg transition-colors' >
                  <i className="ri-link text-2xl text-blue-500"></i>
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : <div className='opacity-0'></div>
}

export default Product
