const Order = ({ order, backendUrl, currency }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Order Placed': 'yellow',
      'Confirmed': 'blue',
      'Shipped': 'indigo',
      'Out for Delivery': 'purple',
      'Delivered': 'green',
      'Cancelled': 'red'
    };
    return colors[status] || 'gray';
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${backendUrl}/uploads/${imagePath}`;
  };

  return (
    <div className='bg-neutral-100 rounded-sm p-6'>
      <div className='flex justify-between items-center mb-4'>
        <div>
          <h3 className='font-medium'>ORDER #{order._id.slice(-6)}</h3>
          <p>{new Date(order.date).toLocaleDateString()}</p>
        </div>
        <div className={`px-3 py-1 uppercase bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
          {order.status}
        </div>
      </div>
      <div className='flex flex-wrap gap-4'>
        {order.items.map((item, idx) => (
          <div key={idx} className='flex gap-4 border-t pt-4'>
            <img src={item.image && item.image[0] ? getImageUrl(item.image[0]) : ''} alt={item.name} className='w-16 object-cover' />
            <div>
              <h4 className='font-medium'>{item.name}</h4>
              <p>{currency}{item.price}</p>
              <p>{item.quantity} ITEMS</p>
              {item.sellerId && (
                <div className='text-sm'>
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
          <p>STATUS:
            <span className={order.payment ? 'text-green-600 ml-1 uppercase' : 'text-yellow-600 ml-1 uppercase'}>
              {order.payment ? 'Completed' : 'Pending'}
            </span>
          </p>
        </div>
        <p className='font-medium'>TOTAL: {currency}{order.amount}</p>
      </div>
    </div>
  );
};

export default Order; 