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

    const statusOptions = ["Assigned", "Shipped", "Delivered"];

    const fetchAssignedOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get("/delivery/assigned-orders");
            // Accessing the orders array correctly from your new backend structure
            setActiveDeliveries(response.data.orders || []);
        } catch (error) {
            toast.error("Failed to fetch assigned orders");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/delivery/order/${orderId}/status`, { status: newStatus });
            toast.success(`Order updated to ${newStatus}`);
            fetchAssignedOrders();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        if (user) {
            fetchAssignedOrders();
        }
    }, [user]);

    if (loading) return <div className="pt-28 text-center text-gray-500 font-bold">Loading assigned orders...</div>;

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

                                <h3 className="text-xl font-bold text-gray-800">
                                    {order.deliveryAddress?.firstName || order.userId?.name} {order.deliveryAddress?.lastName || ""}
                                </h3>
                                <p className="text-gray-600 flex items-center gap-2 italic text-sm">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    {order.deliveryAddress?.street || order.userId?.address || "No Address provided"}
                                    {order.deliveryAddress?.city ? `, ${order.deliveryAddress.city}` : ""}
                                </p>
                                <div className="text-sm text-gray-500 font-semibold mt-2">
                                    Total: <span className="text-green-600">${order.totalAmount}</span>
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex flex-col items-end gap-3 w-full md:w-auto">
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
                                    onClick={() => {
                                        const street = order.deliveryAddress?.street || order.userId?.address || "";
                                        const city = order.deliveryAddress?.city || "";
                                        const addressString = `${street} ${city}`.trim();

                                        if (addressString) {
                                            // Fixed the Google Maps link string
                                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressString)}`, '_blank');
                                        } else {
                                            toast.error("No valid address to open in Maps");
                                        }
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
                        <div className="text-gray-300 mb-4 flex justify-center"><FaCheckCircle size={40} /></div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">All Caught Up!</h3>
                        <p className="text-gray-500 font-medium">No active deliveries assigned to you.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeliveryTracking;