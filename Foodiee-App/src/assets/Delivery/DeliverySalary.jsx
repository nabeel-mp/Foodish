import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { 
  FaMoneyBillWave, 
  FaTruck, 
  FaCalendarCheck, 
  FaWallet, 
  FaArrowTrendUp,
  FaCircleInfo
} from 'react-icons/fa6';
import { motion } from 'framer-motion';

const DeliverySalary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSalarySummary = async () => {
    try {
      setLoading(true);
      const res = await api.get('/delivery/salary-summary');
      setSummary(res.data?.data || null);
    } catch (error) {
      console.error('Failed to fetch salary summary', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalarySummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Calculating Earnings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 md:pt-32 pb-12 px-4 md:px-10 text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center justify-center md:justify-start gap-3">
              Wallet <span className="text-orange-500">Studio</span>
            </h1>
            <p className="text-slate-500 font-medium italic text-sm">Transparent breakdown of your delivery commissions.</p>
          </div>
        </header>

        {/* Earnings Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          
          {/* Wage Rate Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 group hover:border-orange-200 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-inner">
                <FaMoneyBillWave size={24} />
              </div>
              <FaCircleInfo className="text-slate-200" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Wage Per Delivery</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              ₹{summary?.wagePerDelivery || 25}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Standard flat rate per successful drop</p>
          </motion.div>

          {/* Performance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 group hover:border-blue-200 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-colors shadow-inner">
                <FaTruck size={24} />
              </div>
              <div className="bg-blue-50 px-3 py-1 rounded-full text-[9px] font-black text-blue-600 uppercase tracking-widest">Lifetime</div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Delivered</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">
              {summary?.totalDelivered || 0}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Successful deliveries since onboarding</p>
          </motion.div>

          {/* Current Month Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border border-slate-800 group relative overflow-hidden"
          >
            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 opacity-10 text-white rotate-12">
               <FaArrowTrendUp size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl shadow-inner">
                <FaCalendarCheck size={24} />
              </div>
              <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Active Month</div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">Current Earnings</p>
            <p className="text-4xl font-black text-white tracking-tighter relative z-10">
              ₹{summary?.monthSalary || 0}
            </p>
            <div className="flex items-center gap-2 mt-2 relative z-10">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                From {summary?.monthDelivered || 0} Orders
              </p>
            </div>
          </motion.div>

          {/* Total Accumulated Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 group hover:border-emerald-200 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-inner">
                <FaWallet size={24} />
              </div>
              <FaArrowTrendUp className="text-emerald-400" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-4xl font-black text-emerald-600 tracking-tighter">
              ₹{summary?.totalSalary || 0}
            </p>
            <p className="text-[10px] font-bold text-slate-400 mt-2 italic">Gross earnings to date</p>
          </motion.div>

        </div>

        {/* Footer info */}
        <footer className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-orange-500 shadow-sm shrink-0">
              <FaCircleInfo size={18} />
           </div>
           <p className="text-xs text-slate-500 leading-relaxed font-medium">
             Salary updates are real-time. Payments are processed every Monday. If you notice any discrepancies in order counts, please contact support.
           </p>
        </footer>
      </div>
    </div>
  );
};

export default DeliverySalary;