import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

const DeliveryDashboard = () => {
  const [currentOrder, setCurrentOrder] = useState(null);

  const fetchCurrentOrder = async () => {
    try {
      const res = await api.get('/delivery/my-order');
      setCurrentOrder(res.data);
    } catch (error) {
      console.error("Error fetching order", error);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const updateStatus = async (status) => {
    try {
      await api.put(`/delivery/order/${currentOrder._id}/status`, { status });
      if (status === 'Delivered') {
        // Refresh to check if a new order was auto-assigned from the queue
        fetchCurrentOrder(); 
      } else {
        setCurrentOrder({ ...currentOrder, status });
      }
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  if (!currentOrder) {
    return <div className="p-8 text-center text-xl">Waiting for new orders... You are currently available.</div>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Current Delivery</h2>
      <div className="border p-4 rounded shadow-md bg-white">
        <p><strong>Order ID:</strong> {currentOrder._id}</p>
        <p><strong>Customer Address:</strong> {currentOrder.userId?.address}</p>
        <p><strong>Status:</strong> <span className="text-blue-600 font-bold">{currentOrder.status}</span></p>
        
        <div className="mt-6 flex gap-4">
          {currentOrder.status === 'Assigned' && (
            <button 
              onClick={() => updateStatus('Shipped')}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Mark as Shipped (Out for delivery)
            </button>
          )}
          {currentOrder.status === 'Shipped' && (
            <button 
              onClick={() => updateStatus('Delivered')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard;