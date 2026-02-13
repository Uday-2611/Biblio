const Order = ({ order, backendUrl, currency }) => {
  const getStatusClasses = (status) => {
    const classes = {
      'Order Placed': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-indigo-100 text-indigo-800',
      'Out for Delivery': 'bg-violet-100 text-violet-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-neutral-100 text-neutral-700';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${backendUrl}/uploads/${imagePath}`;
  };

  return (
    <div className='rounded-2xl border border-white/85 bg-white/80 p-6 font-[SourceSans] shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h3 className='font-[Gambarino] text-xl text-neutral-900'>ORDER #{order._id.slice(-6)}</h3>
          <p className='text-neutral-600'>{new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className={`px-3 py-1 uppercase rounded-full text-xs font-semibold tracking-[0.1em] ${getStatusClasses(order.status)}`}>
          {order.status}
        </div>
      </div>
      <div className='flex flex-wrap gap-4'>
        {order.items.map((item, idx) => (
          <div key={idx} className='flex gap-4 border-t pt-4'>
            <img src={item.image && item.image[0] ? getImageUrl(item.image[0]) : ''} alt={item.name} className='w-16 h-20 rounded-lg object-cover bg-white border border-white' />
            <div>
              <h4 className='font-medium text-neutral-900'>{item.name}</h4>
              <p className='text-neutral-700'>{currency}{item.price}</p>
              <p className='text-neutral-600 text-sm'>{item.quantity} ITEMS</p>
              {item.sellerId && (
                <div className='text-sm text-neutral-600'>
                  <p>SELLER: {item.sellerId.name}</p>
                  <p>CONTACT: {item.sellerId.email}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className='mt-4 flex justify-between items-center border-t pt-4'>
        <div>
          <p className='text-neutral-700'>STATUS:
            <span className={order.payment ? 'text-green-600 ml-1 uppercase' : 'text-yellow-600 ml-1 uppercase'}>
              {order.payment ? 'Completed' : 'Pending'}
            </span>
          </p>
        </div>
        <p className='font-semibold text-neutral-900'>TOTAL: {currency}{order.amount}</p>
      </div>
    </div>
  );
};

export default Order; 
