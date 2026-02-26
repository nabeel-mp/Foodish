import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaCalendarDays, 
  FaBoxOpen, 
  FaArrowLeft, 
  FaCircleCheck, 
  FaCircleXmark, 
  FaClock 
} from "react-icons/fa6";
import { motion } from "framer-motion";
import api from "../../api/axios";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        if (response.data.success) {
          setUserData(response.data.data.user);
          setOrders(response.data.data.orders);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 max-w-md w-full">
          <FaUser size={40} className="mx-auto text-slate-200 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 leading-tight">User Not Found</h2>
          <button
            onClick={() => navigate("/admin/users")}
            className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95"
          >
            Back to Directory
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
          onClick={() => navigate(-1)} 
          className="flex items-center gap-3 text-slate-400 hover:text-orange-600 font-black uppercase tracking-widest text-[10px] mb-8 transition-all group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: User Profile Card (Dish-style box) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-4"
          >
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 text-center relative overflow-hidden">
              <span className="absolute top-6 left-6 px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                {userData.role || "Customer"}
              </span>

              <div className="w-28 h-28 rounded-[2rem] bg-orange-500 mx-auto mt-6 mb-6 flex items-center justify-center text-4xl font-black text-white shadow-lg shadow-orange-100 ring-4 ring-white">
                {userData.name.charAt(0).toUpperCase()}
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{userData.name}</h2>
              
              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-4 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:border-orange-100">
                  <FaEnvelope className="text-orange-500" />
                  <div className="text-left overflow-hidden">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Email Address</p>
                    <p className="text-xs font-bold truncate">{userData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-slate-600 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-white hover:border-orange-100">
                  <FaCalendarDays className="text-orange-500" />
                  <div className="text-left">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Account Created</p>
                    <p className="text-xs font-bold">{new Date(userData.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Order History (Card Grid for Responsiveness) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase text-sm tracking-widest">
                <FaBoxOpen className="text-orange-500" /> Purchase History
              </h3>
              <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black text-slate-400 border border-slate-200">
                {orders.length} Records
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold italic">This customer hasn't placed any orders yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {orders.map((order, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={order._id} 
                    className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Ref</p>
                        <p className="text-xs font-black text-slate-900 group-hover:text-orange-600 transition-colors">#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                      <div>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Date</p>
                        <p className="text-xs font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Paid</p>
                        <p className="text-lg font-black text-orange-600 tracking-tighter">₹{order.total}</p>
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

/* --- Refactored Status Badge for Cleanliness --- */
const StatusBadge = ({ status }) => {
  const config = {
    Delivered: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100", icon: <FaCircleCheck size={10}/> },
    Cancelled: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100", icon: <FaCircleXmark size={10}/> },
    Processing: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", icon: <FaClock size={10}/> },
  };

  const style = config[status] || config.Processing;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border}`}>
      {style.icon}
      {status || "Pending"}
    </span>
  );
};

export default UserDetails;