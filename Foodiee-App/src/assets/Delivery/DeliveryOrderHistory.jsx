import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
  FaClipboardList, 
  FaCalendarCheck, 
  FaMapPin, 
  FaCreditCard, 
  FaReceipt,
  FaCircleCheck,
  FaChevronRight
} from 'react-icons/fa6';
import { motion, AnimatePresence } from 'framer-motion';

const DeliveryOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery/order-history');
      const list = Array.isArray(res.data) ? res.data : (res.data?.orders || []);
      setOrders(list);
    } catch (error) {
      console.error('Failed to fetch delivery history', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Records...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 md:pt-32 pb-12 px-4 md:px-10 text-slate-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Delivery <span className="text-orange-500">Log</span>
            </h1>
            <p className="text-slate-500 font-medium italic text-sm">Your completed journey and earnings history.</p>
          </div>
          <div className="bg-white px-5 py-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Trips</span>
            <p className="text-xl font-black text-slate-900 leading-none mt-1">{orders.length}</p>
          </div>
        </header>

        {/* History Feed - No Table, Just Responsive Cards */}
        <div className="space-y-4">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2rem] border border-slate-200 p-5 md:p-8 shadow-sm hover:border-orange-200 transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left: ID & Date */}
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 shadow-inner">
                      <FaCircleCheck size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Order Ref</span>
                        <FaChevronRight size={8} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mt-0.5">
                        <FaCalendarCheck size={12} className="text-slate-300" />
                        {new Date(order.updatedAt || order.createdAt).toLocaleDateString(undefined, { 
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Logistics & Customer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1 lg:px-10 border-y lg:border-y-0 lg:border-x border-slate-50 py-6 lg:py-0">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FaUserCircleIcon /> Customer
                      </p>
                      <p className="text-sm font-bold text-slate-700">{order.name || order.userId?.name || 'Customer'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <FaMapPin size={10} className="text-orange-400" /> Destination
                      </p>
                      <p className="text-sm font-medium text-slate-500 line-clamp-1 group-hover:text-slate-700 transition-colors">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  {/* Right: Payment & Amount */}
                  <div className="flex items-center justify-between lg:justify-end lg:gap-12 shrink-0">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex lg:justify-end items-center gap-2">
                        <FaCreditCard size={10} /> {order.paymentMethod || 'COD'}
                      </p>
                      <p className="text-2xl font-black text-emerald-600 tracking-tighter">
                        ₹{Number(order.total || 0).toFixed(0)}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-300 group-hover:text-orange-500 transition-colors">
                      <FaReceipt size={18} />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {orders.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-slate-100"
            >
              <FaClipboardList className="mx-auto text-slate-100 mb-4" size={60} />
              <p className="text-slate-400 font-bold italic tracking-wide">No completed deliveries found in your ledger.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Inline Icon Helper --- */
const FaUserCircleIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="12" width="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 96c48.6 0 88 39.4 88 88s-39.4 88-88 88-88-39.4-88-88 39.4-88 88-88zm0 344c-58.7 0-111.3-26.6-146.5-68.2 18.8-35.4 55.6-59.8 98.5-59.8 2.4 0 4.8.4 7.1 1.1 13 4.2 26.6 6.9 40.9 6.9s28-2.7 40.9-6.9c2.3-.7 4.7-1.1 7.1-1.1 42.9 0 79.7 24.4 98.5 59.8C359.3 421.4 306.7 448 248 448z"></path>
  </svg>
);

export default DeliveryOrderHistory;