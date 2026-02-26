import React, { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin,
  Phone,
  User,
  Hash,
  Box,
  Printer,
  ReceiptText,
  X,
  Scissors,
  Clock,
  History as HistoryIcon
} from "lucide-react";
import { toast } from "react-hot-toast";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("available"); // New state for tabs

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/allorders");
      setOrders(data);
    } catch (error) {
      toast.error("Failed to sync orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintAction = () => {
    window.print();
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

  // 1. Logic for filtering by Tab (Available vs History)
  const tabFilteredOrders = orders.filter(order => {
    if (activeTab === "available") {
      return order.status === "Pending" || order.status === "Shipped";
    } else {
      return order.status === "Delivered" || order.status === "Cancelled";
    }
  });

  // 2. Logic for filtering by Search Term
  const filteredOrders = tabFilteredOrders.filter(order => 
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
      <div className={`max-w-7xl mx-auto print:hidden`}>
        
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              Order <span className="text-orange-500">Manifest</span>
            </h2>
            <p className="text-slate-500 font-medium italic">Manage live logistics and check historical data.</p>
          </div>

          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-orange-500 transition-colors">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search ID, Phone or Customer..."
              className="pl-11 pr-6 py-3 w-full md:w-80 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* --- TABS NAVIGATION --- */}
        <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit mb-10 gap-1 border border-slate-200">
          <button
            onClick={() => setActiveTab("available")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "available" 
              ? "bg-white text-orange-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Clock size={16} />
            AVAILABLE
            <span className="ml-1 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                {orders.filter(o => o.status === "Pending" || o.status === "Shipped").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "history" 
              ? "bg-white text-slate-900 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <HistoryIcon size={16} />
            HISTORY
            <span className="ml-1 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                {orders.filter(o => o.status === "Delivered" || o.status === "Cancelled").length}
            </span>
          </button>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden group hover:border-orange-200 transition-all duration-300"
              >
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

                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 bg-orange-50 p-2 rounded-lg text-orange-500">
                       <MapPin size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Destination</span>
                      <p className="text-sm font-bold text-slate-700 leading-relaxed italic line-clamp-2">
                        {order.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-2xl">
                    <Phone size={18} className="text-orange-400" />
                    <span className="font-mono font-bold tracking-widest">{order.phone}</span>
                  </div>
                </div>

                <div className="mt-auto p-5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 truncate max-w-[100px]">{order.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 block -mb-1">Amount Paid</span>
                    <span className="text-lg font-black text-slate-900">₹{order.total?.toLocaleString()}</span>
                  </div>
                </div>

                <div className="px-5 pb-5 bg-slate-50/80">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-orange-500 hover:text-orange-500 text-slate-700 font-black text-xs rounded-xl px-4 py-3 transition-all uppercase tracking-widest group/btn"
                  >
                    <Printer size={16} />
                    Generate Receipt
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredOrders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <ReceiptText size={100} className="text-slate-200 animate-pulse" />
              <Search className="absolute -bottom-2 -right-2 text-orange-400 bg-white rounded-full p-2 shadow-lg" size={40} />
            </div>
            <h3 className="mt-6 text-xl font-black text-slate-800 uppercase tracking-widest">No Matches</h3>
            <p className="text-slate-400 text-sm mt-2">No {activeTab} orders match your search.</p>
          </div>
        )}
      </div>

      {/* --- THERMAL RECEIPT MODAL remains unchanged --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-[350px] rounded-b-xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:static print:m-0"
            >
              <div className="flex items-center justify-between p-4 bg-slate-100 border-b print:hidden">
                <h3 className="text-xs font-black uppercase tracking-tighter text-slate-500">Thermal Preview</h3>
                <div className="flex gap-2">
                  <button onClick={handlePrintAction} className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors">
                    <Printer size={16} />
                  </button>
                  <button onClick={() => setSelectedOrder(null)} className="bg-white text-slate-500 p-2 rounded-lg border border-slate-200 hover:bg-slate-50">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6 font-mono text-sm text-slate-800 bg-white" id="receipt-paper">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter">Foodish Restaurant</h2>
                  <p className="text-[10px] text-slate-500">GSTIN: 27AAACF1234F1Z5</p>
                  <div className="mt-2 border-b border-dashed border-slate-300 w-full" />
                </div>
                <div className="space-y-1 mb-4 text-[11px]">
                  <div className="flex justify-between"><span>DATE:</span><span>{new Date().toLocaleDateString()}</span></div>
                  <div className="flex justify-between"><span>ORDER ID:</span><span>#{selectedOrder._id.slice(-8).toUpperCase()}</span></div>
                  <div className="flex justify-between"><span>CUST:</span><span className="truncate max-w-[150px] uppercase">{selectedOrder.name}</span></div>
                  <div className="flex justify-between"><span>PHONE:</span><span>{selectedOrder.phone}</span></div>
                </div>
                <div className="border-b border-dashed border-slate-300 mb-4" />
                <table className="w-full text-[11px] mb-4">
                  <thead><tr className="text-left"><th className="pb-2">ITEM</th><th className="pb-2 text-center">QTY</th><th className="pb-2 text-right">AMT</th></tr></thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="border-b border-dotted border-slate-100">
                        <td className="py-2 pr-2">{item.title}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right">₹{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="space-y-1 text-right mb-6">
                  <div className="flex justify-between text-[10px]"><span>SUBTOTAL:</span><span>₹{selectedOrder.total}</span></div>
                  <div className="flex justify-between text-[10px]"><span>TAX (5%):</span><span>₹0.00</span></div>
                  <div className="flex justify-between font-black text-lg pt-2 border-t border-dashed border-slate-300">
                    <span>TOTAL:</span><span>₹{selectedOrder.total?.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-[10px] leading-tight text-slate-500 uppercase">Delivery To: {selectedOrder.address}</p>
                  <div className="flex justify-center py-2 opacity-20">
                    <Scissors size={14} className="rotate-90" /><div className="border-t border-dashed border-slate-400 w-full mt-2 mx-2" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Thank You!</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-paper, #receipt-paper * { visibility: visible; }
          #receipt-paper {
            position: absolute; left: 0; top: 0;
            width: 80mm;
            padding: 0; margin: 0;
          }
          @page { size: auto; margin: 0mm; }
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;