import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaBox, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaTruck, 
  FaUser, 
  FaClock, 
  FaSyncAlt 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const DeliveryDashboard = () => {
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery/my-order');
      setCurrentOrder(res.data);
    } catch (error) {
      console.error("Error fetching order", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentOrder();
  }, []);

  const updateStatus = async (status) => {
    try {
      await api.put(`/delivery/order/${currentOrder._id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      
      if (status === 'Delivered') {
        fetchCurrentOrder(); 
      } else {
        setCurrentOrder({ ...currentOrder, status });
      }
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-yellow-500 text-4xl"
        >
          <FaSyncAlt />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              Delivery <span className="text-yellow-500">Panel</span>
            </h2>
            <p className="text-gray-500 font-medium">Manage your active assignments</p>
          </div>
          <button 
            onClick={fetchCurrentOrder}
            className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow text-gray-600 hover:text-yellow-500"
          >
            <FaSyncAlt />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!currentOrder ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaClock className="text-yellow-500 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Orders</h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                You are currently visible as available. New orders will appear here automatically.
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid gap-6"
            >
              {/* Main Order Card */}
              <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FaBox className="text-yellow-500" />
                    <span className="font-black tracking-widest text-sm uppercase">Order #{currentOrder._id.slice(-6)}</span>
                  </div>
                  <div className="bg-yellow-500 text-gray-900 px-4 py-1 rounded-full text-xs font-black uppercase">
                    {currentOrder.status}
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Address Section */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-red-50 p-4 rounded-2xl">
                      <FaMapMarkerAlt className="text-red-500 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Customer Address</h4>
                      <p className="text-lg font-bold text-gray-800 leading-tight">
                        {currentOrder.userId?.address || "Address not provided"}
                      </p>
                    </div>
                  </div>

                  <hr className="border-gray-50" />

                  {/* Customer Info Section */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-50 p-4 rounded-2xl">
                      <FaUser className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-1">Customer Name</h4>
                      <p className="text-lg font-bold text-gray-800">
                        {currentOrder.userId?.name || "Customer"}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4">
                    {currentOrder.status === 'Assigned' && (
                      <button 
                        onClick={() => updateStatus('Shipped')}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-yellow-100 transition-all flex items-center justify-center space-x-3 group"
                      >
                        <FaTruck className="group-hover:translate-x-2 transition-transform" />
                        <span>Start Delivery Path</span>
                      </button>
                    )}
                    
                    {currentOrder.status === 'Shipped' && (
                      <button 
                        onClick={() => updateStatus('Delivered')}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-lg shadow-green-100 transition-all flex items-center justify-center space-x-3 group"
                      >
                        <FaCheckCircle className="text-xl" />
                        <span>Confirm Successful Delivery</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tips/Safety Card */}
              <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-100 flex items-center space-x-4">
                <div className="text-yellow-600 text-2xl">⚡</div>
                <p className="text-yellow-800 text-sm font-medium">
                  <strong>Pro-tip:</strong> Always verify the order items with the restaurant before leaving for delivery.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DeliveryDashboard;