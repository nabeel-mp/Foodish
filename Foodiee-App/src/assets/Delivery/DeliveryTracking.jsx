import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaCheckCircle, FaClock, FaTruck, FaChevronDown } from "react-icons/fa";
import api from "../../api/axios";
import { StoreContext } from "../storecontext/StoreContext";
import { toast } from "react-hot-toast";

const DeliveryTracking = () => {
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(StoreContext);

  // FIXED: Matched statuses with your backend logic
  const statusOptions = ["Assigned", "Shipped", "Delivered"];

  const fetchAssignedOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/delivery/assigned-orders");
      setActiveDeliveries(response.data);
    } catch (error) {
      toast.error("Failed to fetch assigned orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // FIXED: Matched endpoint with your DeliveryDashboard component
      await api.put(`/delivery/order/${orderId}/status`, { status: newStatus });
      toast.success(`Order updated to ${newStatus}`);
      fetchAssignedOrders(); 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    if (user && user.role === "delivery") {
      fetchAssignedOrders();
    }
  }, [user]);

  if (loading) return <div className="pt-28 text-center">Loading assigned orders...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <FaTruck className="text-yellow-500" /> Live Delivery Tracking
        </h1>

        <div className="grid gap-6">
          {activeDeliveries.map((order) => (
            <motion.div 
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded uppercase">
                    ID: {order._id.slice(-6)}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FaClock size={12} /> {new Date(order.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {/* NOTE: Make sure order.address actually exists in your DB schema. 
                    If you use userId.name like in Dashboard, change this to order.userId?.name */}
                <h3 className="text-xl font-bold text-gray-800">
                  {order.address?.firstName || order.userId?.name} {order.address?.lastName || ""}
                </h3>
                <p className="text-gray-600 flex items-center gap-2 italic text-sm">
                  <FaMapMarkerAlt className="text-red-500" /> 
                  {order.address?.street || order.userId?.address}, {order.address?.city || ""}
                </p>
                <div className="text-sm text-gray-500">
                  Items: {order.items?.length || 0} | Total: ${order.amount}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-end gap-3">
                <div className="relative inline-block w-full md:w-auto">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-xl font-semibold focus:outline-none focus:bg-white focus:border-yellow-500 cursor-pointer w-full"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaChevronDown size={10} />
                  </div>
                </div>

                <button 
                  // FIXED: Corrected Google Maps Search URL
                  onClick={() => {
                    const addressString = `${order.address?.street || order.userId?.address} ${order.address?.city || ""}`;
                    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`, '_blank');
                  }}
                  className="bg-yellow-500 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-yellow-600 transition-all shadow-md w-full md:w-auto"
                >
                  Open Maps
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {activeDeliveries.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">No active deliveries assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTracking;