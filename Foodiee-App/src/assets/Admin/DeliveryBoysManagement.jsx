import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, 
  Trash2, 
  Eye,
  Mail, 
  Phone, 
  CircleDollarSign, 
  Truck, 
  X,
  Search,
  UserCheck,
  CalendarDays,
  MapPin,
  CreditCard
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { showConfirmToast } from "../../utils/confirmToast";

const DeliveryBoysManagement = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedBoyDetails, setSelectedBoyDetails] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });

  const fetchDeliveryBoys = async () => {
    try {
      const res = await api.get('/admin/delivery-boys');
      setDeliveryBoys(res.data);
    } catch (error) {
      console.error('Error fetching delivery boys', error);
      toast.error("Failed to load personnel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Creating account...");
    try {
      await api.post('/admin/delivery-boys', formData);
      toast.success('Personnel added successfully!', { id: loadingToast });
      setFormData({ name: '', email: '', password: '', phone: '' });
      setIsModalOpen(false);
      fetchDeliveryBoys();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating account', { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirmToast({
      title: "Remove this personnel?",
      description: "This account will be deleted permanently.",
      confirmText: "Remove",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/delivery-boys/${id}`);
      toast.success('Account deleted');
      fetchDeliveryBoys();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleTogglePresence = async (id, currentPresence) => {
    try {
      await api.patch(`/admin/delivery-boys/${id}/presence`);
      setDeliveryBoys((prev) =>
        prev.map((boy) => (boy._id === id ? { ...boy, isPresent: !currentPresence } : boy))
      );
      toast.success(`Marked as ${currentPresence ? 'Absent' : 'Present'}`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update presence");
    }
  };

  const filteredBoys = deliveryBoys.filter(boy => 
    boy.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    boy.phone.includes(searchTerm)
  );

  const handleViewDetails = async (id) => {
    setDetailsLoading(true);
    setIsDetailsModalOpen(true);
    try {
      const res = await api.get(`/admin/delivery-boys/${id}`);
      setSelectedBoyDetails(res.data?.data || null);
    } catch (error) {
      toast.error("Failed to load personnel details");
      setSelectedBoyDetails(null);
      setIsDetailsModalOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Delivery <span className="text-orange-500">Personnel</span>
            </h2>
            <p className="text-slate-500 font-medium italic text-sm">Manage your delivery team and wage distributions.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative group flex-1 sm:flex-none">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search team..."
                className="pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none w-full sm:w-64 transition-all shadow-sm font-bold"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl active:scale-95"
            >
              <UserPlus size={16} />
              Add Personnel
            </button>
          </div>
        </header>

        {/* Personnel Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredBoys.map((boy) => (
              <motion.div
                key={boy._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] border border-slate-200 p-6 hover:shadow-lg transition-all group relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-16 w-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-inner">
                    <UserCheck size={32} />
                  </div>
                  <div className="flex flex-col gap-1.5 items-end">
                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${boy.isPresent !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {boy.isPresent !== false ? 'Present' : 'Absent'}
                    </div>
                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${boy.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                      {boy.isAvailable ? 'Available' : 'Busy'}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">{boy.name}</h4>
                    <div className="space-y-1 mt-2">
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold truncate">
                        <Mail size={12} className="text-orange-400" /> {boy.email}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                        <Phone size={12} className="text-orange-400" /> {boy.phone}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Deliveries</span>
                      <span className="text-2xl font-black text-slate-900 leading-none">{boy.deliveredCount || 0}</span>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100/50">
                      <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest block mb-1">Wages</span>
                      <span className="text-2xl font-black text-orange-600 leading-none">₹{boy.wages || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <button
                    onClick={() => handleTogglePresence(boy._id, boy.isPresent !== false)}
                    className={`py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${
                      boy.isPresent !== false
                        ? 'bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100'
                        : 'bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    <CalendarDays size={14} />
                    {boy.isPresent !== false ? 'Mark Absent' : 'Mark Present'}
                  </button>
                  <button 
                    onClick={() => handleViewDetails(boy._id)}
                    className="py-3.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Eye size={14} /> Details
                  </button>
                  <button 
                    onClick={() => handleDelete(boy._id)}
                    className="py-3.5 rounded-2xl bg-white border border-rose-100 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Details Modal - Redesigned for Mobile (No Tables) */}
        <AnimatePresence>
          {isDetailsModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white w-full max-w-5xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Performance Log</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Personnel Activity Overview</p>
                  </div>
                  <button
                    onClick={() => { setIsDetailsModalOpen(false); setSelectedBoyDetails(null); }}
                    className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto space-y-8">
                  {detailsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                       <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Records...</p>
                    </div>
                  ) : selectedBoyDetails && (
                    <>
                      {/* Summary Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <SummaryStat label="Personnel" val={selectedBoyDetails.deliveryBoy.name} />
                        <SummaryStat label="Completed" val={selectedBoyDetails.deliveredCount} />
                        <SummaryStat label="In Progress" val={selectedBoyDetails.activeCount} />
                        <SummaryStat label="Total Wages" val={`₹${selectedBoyDetails.totalWages}`} highlight />
                      </div>

                      {/* Orders Log - Responsive Cards instead of Table */}
                      <div className="space-y-4">
                        <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order History</h4>
                        {selectedBoyDetails.orders.map((order) => (
                          <div key={order._id} className="bg-slate-50 rounded-3xl p-5 border border-slate-100 hover:border-orange-200 transition-all group">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-orange-500 transition-colors">
                                  <Truck size={20} />
                                </div>
                                <div>
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">ID: #{order._id.slice(-8).toUpperCase()}</span>
                                  <h5 className="font-bold text-slate-900">{order.name || order.userId?.name || 'Walk-in Customer'}</h5>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 md:flex items-center gap-6">
                                <div className="space-y-0.5">
                                  <p className="text-[9px] font-black text-slate-400 uppercase">Status</p>
                                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase ${
                                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-[9px] font-black text-slate-400 uppercase">Amount</p>
                                  <p className="text-sm font-black text-slate-900">₹{order.total}</p>
                                </div>
                                <div className="space-y-0.5 hidden md:block">
                                  <p className="text-[9px] font-black text-slate-400 uppercase">Date</p>
                                  <p className="text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-200/50 flex flex-col md:flex-row md:items-center gap-4 text-xs">
                              <div className="flex items-center gap-2 text-slate-500 flex-1">
                                <MapPin size={14} className="text-orange-400 shrink-0" />
                                <span className="font-medium line-clamp-1">{order.address || 'Standard Delivery'}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-500">
                                <CreditCard size={14} className="text-orange-400" />
                                <span className="font-bold uppercase tracking-widest text-[10px]">{order.paymentMethod || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {selectedBoyDetails.orders.length === 0 && (
                          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                            <p className="text-slate-400 font-bold italic">No delivery activity on record.</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* CREATE PERSONNEL MODAL */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8 text-center sm:text-left">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Recruitment</h3>
                      <p className="text-slate-500 text-sm font-medium italic">Create delivery credentials</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <InputField label="Full Name" name="name" type="text" placeholder="John Doe" val={formData.name} change={handleInputChange} />
                    <InputField label="Email Address" name="email" type="email" placeholder="john@studio.com" val={formData.email} change={handleInputChange} />
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Phone" name="phone" type="text" placeholder="9876..." val={formData.phone} change={handleInputChange} />
                      <InputField label="Password" name="password" type="password" placeholder="••••••" val={formData.password} change={handleInputChange} />
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs mt-6 hover:bg-orange-600 shadow-xl shadow-slate-200 transition-all active:scale-95"
                    >
                      Complete Recruitment
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {!loading && filteredBoys.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100">
            <Truck size={80} className="text-slate-100 mb-6" />
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">Empty Personnel Roster</h3>
          </div>
        )}
      </div>
    </div>
  );
};

/* --- Helpers --- */

const SummaryStat = ({ label, val, highlight }) => (
  <div className={`${highlight ? 'bg-orange-500 text-white' : 'bg-slate-50 text-slate-900'} p-5 rounded-[1.8rem] border border-transparent`}>
    <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${highlight ? 'text-orange-100' : 'text-slate-400'}`}>{label}</p>
    <p className="text-lg font-black truncate">{val}</p>
  </div>
);

const InputField = ({ label, name, type, placeholder, val, change }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">{label}</label>
    <input 
      type={type} name={name} placeholder={placeholder} 
      value={val} onChange={change} required 
      className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-800 shadow-inner"
    />
  </div>
);

export default DeliveryBoysManagement;
