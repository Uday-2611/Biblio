import React from 'react'

const UserReview = ({ review, onDelete, canDelete }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i 
        key={index}
        className={`ri-star-${index < rating ? 'fill' : 'line'} text-yellow-500`}
      />
    ));
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className='bg-neutral-50 p-4 rounded-xl'>
      <div className='flex justify-between items-center mb-2'>
        <div className='flex gap-4 items-center'>
          <div className='w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center'>
            <span className='text-neutral-600 font-medium'>
              {review.userId.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className='font-medium'>{review.userId.name}</h3>
            <div className='flex gap-1'>
              {renderStars(review.rating)}
            </div>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-neutral-500'>
            {formatDate(review.createdAt)}
          </span>
          {canDelete && (
            <button 
              onClick={() => onDelete(review._id)}
              className='text-red-500 hover:text-red-600'
            >
              <i className="ri-delete-bin-line" />
            </button>
          )}
        </div>
      </div>
      <p className='text-neutral-600 ml-14'>{review.review}</p>
    </div>
  )
}

export default UserReview
