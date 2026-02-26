import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Trash2, 
  Eye,
  Mail, 
  Phone, 
  ShieldCheck, 
  CircleDollarSign, 
  Truck, 
  X,
  Plus,
  Search,
  UserCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

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
    if (!window.confirm('Are you sure you want to remove this personnel?')) return;
    try {
      await api.delete(`/admin/delivery-boys/${id}`);
      toast.success('Account deleted');
      fetchDeliveryBoys();
    } catch (error) {
      toast.error('Failed to delete');
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
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Fleet <span className="text-orange-500">Personnel</span>
            </h2>
            <p className="text-slate-500 font-medium italic">Manage your delivery team and wage distributions.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name or phone..."
                className="pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none w-full sm:w-64 transition-all shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors shadow-lg shadow-slate-200"
            >
              <UserPlus size={18} />
              Add Personnel
            </button>
          </div>
        </header>

        {/* Personnel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredBoys.map((boy) => (
              <motion.div
                key={boy._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-orange-200 transition-all shadow-sm group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <UserCheck size={28} />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${boy.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                    {boy.isAvailable ? 'Available' : 'Busy'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-black text-slate-900">{boy.name}</h4>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                      <Mail size={14} /> {boy.email}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Phone size={14} /> {boy.phone}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-dashed border-slate-100">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Deliveries</span>
                      <span className="text-lg font-black text-slate-900">{boy.deliveredCount || 0}</span>
                    </div>
                    <div className="bg-orange-50/50 p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-orange-400 uppercase block">Wages</span>
                      <span className="text-lg font-black text-orange-600">₹{boy.wages || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button 
                    onClick={() => handleViewDetails(boy._id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-100 text-slate-500 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Eye size={16} />
                    Details
                  </button>
                  <button 
                    onClick={() => handleDelete(boy._id)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-slate-100 text-slate-400 hover:border-rose-100 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold text-xs uppercase tracking-widest"
                  >
                    <Trash2 size={16} />
                    Terminate
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {isDetailsModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Personnel Details</h3>
                    <p className="text-sm text-slate-500 font-medium">Order and wage summary</p>
                  </div>
                  <button
                    onClick={() => { setIsDetailsModalOpen(false); setSelectedBoyDetails(null); }}
                    className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 max-h-[75vh] overflow-y-auto">
                  {detailsLoading ? (
                    <div className="text-center py-16 text-slate-500 font-bold">Loading details...</div>
                  ) : !selectedBoyDetails ? (
                    <div className="text-center py-16 text-slate-500 font-bold">No details available.</div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-slate-400 uppercase">Name</p>
                          <p className="text-lg font-black text-slate-900">{selectedBoyDetails.deliveryBoy.name}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-slate-400 uppercase">Delivered</p>
                          <p className="text-lg font-black text-slate-900">{selectedBoyDetails.deliveredCount}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-slate-400 uppercase">Active Orders</p>
                          <p className="text-lg font-black text-slate-900">{selectedBoyDetails.activeCount}</p>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-2xl">
                          <p className="text-xs font-bold text-orange-400 uppercase">Total Wages</p>
                          <p className="text-lg font-black text-orange-600">Rs. {selectedBoyDetails.totalWages}</p>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <th className="px-4 py-3">Order ID</th>
                              <th className="px-4 py-3">Customer</th>
                              <th className="px-4 py-3">Address</th>
                              <th className="px-4 py-3">Amount</th>
                              <th className="px-4 py-3">Payment</th>
                              <th className="px-4 py-3">Status</th>
                              <th className="px-4 py-3">Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBoyDetails.orders.map((order) => (
                              <tr key={order._id} className="border-b border-slate-50">
                                <td className="px-4 py-3 font-bold text-slate-800">#{order._id.slice(-8)}</td>
                                <td className="px-4 py-3 text-slate-700">{order.name || order.userId?.name || 'Customer'}</td>
                                <td className="px-4 py-3 text-slate-600">{order.address || 'N/A'}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">Rs. {Number(order.total || 0).toFixed(2)}</td>
                                <td className="px-4 py-3 text-slate-700">{order.paymentMethod || 'N/A'}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                                    order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                    order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                                    order.status === 'Assigned' ? 'bg-amber-50 text-amber-600' :
                                    'bg-slate-100 text-slate-500'
                                  }`}>
                                    {order.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-slate-500 text-sm">{new Date(order.createdAt).toLocaleString()}</td>
                              </tr>
                            ))}
                            {selectedBoyDetails.orders.length === 0 && (
                              <tr>
                                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 font-semibold">No orders assigned yet.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Overlay */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">New Recruit</h3>
                      <p className="text-slate-500 text-sm font-medium">Create delivery credentials</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-orange-100 hover:text-orange-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                      <input 
                        type="text" name="name" placeholder="John Doe" 
                        value={formData.name} onChange={handleInputChange} required 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-700"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email</label>
                      <input 
                        type="email" name="email" placeholder="john@company.com" 
                        value={formData.email} onChange={handleInputChange} required 
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone</label>
                        <input 
                          type="text" name="phone" placeholder="9876..." 
                          value={formData.phone} onChange={handleInputChange} required 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-700"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Password</label>
                        <input 
                          type="password" name="password" placeholder="••••••" 
                          value={formData.password} onChange={handleInputChange} required 
                          className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none font-bold text-slate-700"
                        />
                      </div>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest mt-6 hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
                    >
                      Confirm Recruitment
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredBoys.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <Truck size={80} className="text-slate-200 animate-pulse mb-4" />
            <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No Personnel Found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoysManagement;
