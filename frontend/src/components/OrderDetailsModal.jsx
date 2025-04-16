import React from 'react';

const OrderDetailsModal = ({ isOpen, onClose, orderId }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl w-[600px] font-['SourceSans']">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">Order Details</h2>
            <button onClick={onClose} className="text-neutral-500" aria-label="Close Modal">
              ✖
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-between text-lg">
              <span className="text-neutral-500">Order ID:</span>
              <span className="font-medium">#{orderId}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-neutral-500">Order Date:</span>
              <span>10/12/2023</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-neutral-500">Delivery Date:</span>
              <span className="text-green-500">15/12/2023</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-neutral-500">Total Amount:</span>
              <span className="font-medium">₹120</span>
            </div>

            <hr className="my-4" />

            <div className="flex gap-4">
              <img src="/book-image.jpg" alt="Book" className="w-20 h-24 object-cover rounded-lg" />
              <div>
                <h3 className="font-medium text-lg">Book Title</h3>
                <p className="text-neutral-500">Author Name</p>
                <p className="font-medium mt-2">₹120</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsModal;