
import React from 'react';

const PlaceOrder = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-4xl font-bold text-yellow-400 text-center">Place Your Order</h2>
        
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="text"
            placeholder="Delivery Address"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            rows="4"
            placeholder="Order Notes (Optional)"
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceOrder;
