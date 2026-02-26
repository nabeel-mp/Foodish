import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaBagShopping, 
  FaHeart, 
  FaArrowLeft, 
  FaLocationDot, 
  FaCreditCard,
  FaCalendarDays
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orderedItemCount, setOrderedItemCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          api.get(`/admin/users/${userId}`),
          api.get(`/orders?userId=${userId}`)
        ]);

        if (userRes.data && userRes.data.role === 'user') {
          setUser(userRes.data);
          setOrders(ordersRes.data);
          const count = ordersRes.data.reduce(
            (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
            0
          );
          setOrderedItemCount(count);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black tracking-widest text-[10px] uppercase">Fetching Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 max-w-sm w-full text-center">
          <FaUser size={40} className="mx-auto text-slate-200 mb-6" />
          <h2 className="text-xl font-black text-slate-900">User Not Found</h2>
          <button onClick={() => navigate("/admin/users")} className="mt-6 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-3 text-slate-400 hover:text-orange-600 font-black uppercase tracking-widest text-[10px] mb-8 transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Customers
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: User Profile Card (Grid Box style like Menu Dishes) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden group">
              {/* Decorative category-like badge */}
              <span className="absolute top-6 left-6 px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                Customer Profile
              </span>

              <div className="w-32 h-32 rounded-[2.5rem] bg-orange-500 mx-auto mt-6 mb-6 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-orange-100 ring-4 ring-white">
                {user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{user.name}</h1>
                <p className="text-slate-400 font-medium text-sm flex items-center justify-center gap-2">
                  <FaEnvelope size={12} className="text-orange-400" /> {user.email}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                  {user.status || 'Active'}
                </span>
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
                  ID: {String(userId).slice(-5)}
                </span>
              </div>

              {/* Miniature Stats Grid inside the Profile Box */}
              <div className="grid grid-cols-3 gap-2 border-t border-slate-50 pt-8">
                <MiniStat label="Orders" val={orders.length} />
                <MiniStat label="Items" val={orderedItemCount} />
                <MiniStat label="Likes" val={user.wishlist?.length || 0} />
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Order History (Responsive Cards) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Purchase History</h3>
              <div className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-slate-400 border border-slate-200 uppercase tracking-widest">
                {orders.length} Total
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100">
                <FaBagShopping className="mx-auto text-slate-200 mb-4" size={40} />
                <p className="text-slate-400 font-bold text-sm">No activity recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={order.id || order._id} 
                    className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden group hover:border-orange-200 transition-all shadow-sm"
                  >
                    {/* Compact Card Header */}
                    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 text-xs tracking-tighter">#{String(order.id || order._id).slice(-6).toUpperCase()}</span>
                        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <FaCalendarDays size={10} />
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Content Body - Fully Stackable */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
                            <FaLocationDot size={14} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Destination</p>
                            <p className="text-xs text-slate-700 font-bold leading-relaxed line-clamp-2">{order.address}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-slate-400">
                            <FaCreditCard size={14} />
                          </div>
                          <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Method</p>
                            <p className="text-xs text-slate-700 font-black">{order.paymentMethod || 'COD'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Items Sub-Section */}
                      <div className="bg-[#FBFBFC] rounded-2xl p-4 border border-slate-100 space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 bg-white rounded border border-slate-200 flex items-center justify-center text-[9px] font-black text-orange-600">
                                {item.quantity}
                              </span>
                              <span className="font-bold text-slate-800">{item.title}</span>
                            </div>
                            <span className="font-black text-slate-900">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                        <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grand Total</span>
                          <span className="text-xl font-black text-orange-600 tracking-tighter">₹{order.total || 0}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Refactored Sub-Components --- */

const MiniStat = ({ label, val }) => (
  <div className="text-center">
    <p className="text-[18px] font-black text-slate-900 tracking-tight">{val}</p>
    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const isDelivered = status === 'Delivered';
  const isCancelled = status === 'Cancelled';
  
  return (
    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border 
      ${isDelivered ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
        isCancelled ? 'bg-rose-50 text-rose-600 border-rose-100' : 
        'bg-blue-50 text-blue-600 border-blue-100'}`}>
      {status || 'In Transit'}
    </span>
  );
};

export default UserDetails;