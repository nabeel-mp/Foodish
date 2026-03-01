import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { showConfirmToast } from "../../utils/confirmToast";

const MyOrder = () => {
  const { user, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/myorders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate, token]);

  // Helper to get status color and icon
  const getStatusDetails = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return { color: 'text-green-500 bg-green-50', icon: <FaCheckCircle /> };
      case 'shipped': return { color: 'text-blue-500 bg-blue-50', icon: <FaTruck /> };
      case 'assigned': return { color: 'text-yellow-600 bg-yellow-50', icon: <FaClock /> };
      case 'cancelled': return { color: 'text-rose-500 bg-rose-50', icon: <FaBoxOpen /> };
      default: return { color: 'text-gray-500 bg-gray-50', icon: <FaBoxOpen /> };
    }
  };

  const isCancellable = (status) => !['shipped', 'delivered', 'cancelled'].includes(String(status || '').toLowerCase());

  const handleCancelOrder = async (orderId) => {
    const confirmed = await showConfirmToast({
      title: "Cancel this order?",
      description: "Cancellation is allowed only before shipping.",
      confirmText: "Cancel Order",
      cancelText: "Keep Order",
      variant: "warning",
    });
    if (!confirmed) return;

    try {
      setCancellingOrderId(orderId);
      await api.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, status: "Cancelled" } : order))
      );
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancellingOrderId("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">
            Order <span className="text-yellow-500">History</span>
          </h2>
          <p className="text-gray-500 mt-1">Track and manage your past and current orders.</p>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[3rem] p-12 text-center shadow-xl shadow-gray-200/50 border border-gray-100"
          >
            <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBoxOpen className="text-yellow-500 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
              You haven't placed any orders yet. Head over to our menu to find something delicious!
            </p>
            <button 
              onClick={() => navigate('/menu')}
              className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-yellow-500 transition-all active:scale-95 shadow-lg"
            >
              Browse Menu
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => {
                const statusInfo = getStatusDetails(order.status);
                return (
                  <motion.div
                    key={order._id || order.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-4 border-b border-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-4 rounded-2xl ${statusInfo.color} text-2xl`}>
                          {statusInfo.icon}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Order ID</p>
                          <p className="text-lg font-black text-gray-900">#{order.id || order._id?.slice(-6)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 md:text-right">
                        <div>
                          <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Date</p>
                          <p className="font-bold text-gray-700">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="md:ml-8">
                          <p className="text-xs uppercase tracking-widest font-bold text-gray-400">Total Amount</p>
                          <p className="text-xl font-black text-yellow-500">₹{order.total ? Number(order.total).toFixed(2) : '0.00'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Body */}
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50/30">
                      <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-4">Items Ordered</h4>
                        <ul className="space-y-3">
                          {(order.items || []).map((item, i) => (
                            <li key={i} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600 font-medium">
                                <span className="text-gray-900 font-bold">{item.quantity}x</span> {item.title}
                              </span>
                              <span className="text-gray-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Delivery Details</h4>
                        <div className="text-sm space-y-1">
                          <p className="text-gray-900 font-bold">{order.name}</p>
                          <p className="text-gray-500 leading-relaxed">{order.address}</p>
                          <p className="text-gray-500">{order.phone}</p>
                        </div>
                        
                        <div className="pt-4 flex items-center justify-between">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${statusInfo.color}`}>
                            {order.status}
                          </span>
                          <span className="text-xs text-gray-400 font-medium italic">
                            Paid via {order.paymentMethod}
                          </span>
                        </div>
                        {isCancellable(order.status) && (
                          <button
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            className="mt-4 w-full md:w-auto px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-all disabled:opacity-50"
                          >
                            {cancellingOrderId === order._id ? "Cancelling..." : "Cancel Order"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;
