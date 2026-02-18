import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Search, 
  MapPin,
  Phone,
  User,
  ChevronRight,
  Hash,
  Box,
  CreditCard
} from "lucide-react";
import { toast } from "react-hot-toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/allorders");
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    const loadingToast = toast.loading(`Updating order to ${newStatus}...`);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order is now ${newStatus}`, { id: loadingToast });
      fetchOrders();
    } catch (error) {
      toast.error("Status update failed", { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return "text-emerald-600 bg-emerald-50 border-emerald-100";
      case 'Shipped': return "text-blue-600 bg-blue-50 border-blue-100";
      case 'Pending': return "text-amber-600 bg-amber-50 border-amber-100";
      case 'Cancelled': return "text-rose-600 bg-rose-50 border-rose-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  const filteredOrders = orders.filter(order => 
    order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.includes(searchTerm) ||
    order.phone?.includes(searchTerm)
  );

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <motion.div animate={{ rotate: [0, 360] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}>
        <Box size={50} className="text-orange-500" />
      </motion.div>
    </div>
  );

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Shipment <span className="text-orange-500">Dispatch</span>
            </h2>
            <p className="text-slate-500 font-medium italic">Priority view focused on inventory and logistics.</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search ID, Phone or Location..."
              className="pl-11 pr-6 py-3 w-full md:w-80 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Dynamic Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden group hover:border-orange-200 transition-all duration-300"
              >
                {/* 1. PRIMARY IMPRESSION: ORDER ID & ITEMS */}
                <div className="p-5 border-b border-dashed border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-1.5 text-slate-900">
                      <Hash size={18} className="text-orange-500" />
                      <span className="font-black text-lg tracking-wider font-mono">
                        {order._id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* High Visibility Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        <div className="h-6 w-6 rounded bg-orange-100 text-orange-600 flex items-center justify-center text-[10px] font-bold">
                          x{item.quantity}
                        </div>
                        <span className="text-sm font-bold text-slate-800 line-clamp-1">{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. LOGISTICS: ADDRESS & CONTACT */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-50 p-2 rounded-lg text-orange-500">
                       <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Delivery Destination</span>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-2xl shadow-lg shadow-slate-200">
                    <Phone size={18} className="text-orange-400" />
                    <span className="font-mono font-bold tracking-widest">{order.phone}</span>
                  </div>
                </div>

                {/* 3. SECONDARY: CUSTOMER & BILLING */}
                <div className="mt-auto p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 truncate max-w-[100px]">{order.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block -mb-1">Amount</span>
                    <span className="text-lg font-black text-slate-900">₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>

                {/* 4. ACTIONS */}
                <div className="px-5 pb-5 bg-slate-50/80">
                  <div className="relative">
                    <select 
                      className="w-full appearance-none bg-white border-2 border-slate-200 text-slate-700 font-black text-xs rounded-xl px-4 py-3 focus:border-orange-500 outline-none cursor-pointer transition-all uppercase tracking-widest"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Mark: Pending</option>
                      <option value="Shipped">Mark: Shipped</option>
                      <option value="Delivered">Mark: Delivered</option>
                      <option value="Cancelled">Mark: Cancelled</option>
                    </select>
                    <ChevronRight size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <Box size={100} className="text-slate-200 animate-pulse" />
              <Search className="absolute -bottom-2 -right-2 text-orange-400 bg-white rounded-full p-2 shadow-lg" size={40} />
            </div>
            <h3 className="mt-6 text-xl font-black text-slate-800 uppercase tracking-widest">No Matches Found</h3>
            <p className="text-slate-400 text-sm mt-2 font-medium">Try searching for a phone number or partial ID.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;