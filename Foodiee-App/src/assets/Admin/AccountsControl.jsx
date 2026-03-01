import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { 
  FaMoneyBillWave, 
  FaTrash, 
  FaPlus, 
  FaWallet, 
  FaArrowTrendUp, 
  FaArrowTrendDown,
  FaReceipt,
  FaFileInvoiceDollar,
  FaChevronRight
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { showConfirmToast } from "../../utils/confirmToast";

const CATEGORY_OPTIONS = [
  { value: "chef_salary", label: "Chef Salary" },
  { value: "groceries", label: "Groceries" },
  { value: "vegetables", label: "Vegetables" },
  { value: "fruits", label: "Fruits" },
  { value: "utilities", label: "Utilities" },
  { value: "rent", label: "Rent" },
  { value: "other", label: "Other" }
];

const AccountsControl = () => {
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [wageLedger, setWageLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [wagePayForm, setWagePayForm] = useState({ deliveryBoyId: "", amount: "", notes: "" });
  const [form, setForm] = useState({ title: "", category: "groceries", amount: "", notes: "", expenseDate: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, expensesRes, wagesRes] = await Promise.all([
        api.get("/admin/accounts/summary"),
        api.get("/admin/accounts/expenses"),
        api.get("/admin/accounts/wages")
      ]);
      setSummary(summaryRes.data?.data || null);
      setExpenses(expensesRes.data?.data || []);
      setWageLedger(wagesRes.data?.data || []);
    } catch (error) {
      toast.error("Failed to load accounts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Recording expense...");
    try {
      await api.post("/admin/accounts/expenses", { ...form, amount: Number(form.amount) });
      toast.success("Expense added", { id: loadingToast });
      setForm({ title: "", category: "groceries", amount: "", notes: "", expenseDate: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense", { id: loadingToast });
    }
  };

  const handlePayWage = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Processing payment...");
    try {
      await api.post("/admin/accounts/wages/pay", { ...wagePayForm, amount: Number(wagePayForm.amount) });
      toast.success("Wage payment recorded", { id: loadingToast });
      setWagePayForm({ deliveryBoyId: "", amount: "", notes: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record payment", { id: loadingToast });
    }
  };

  const handleDeleteExpense = async (id) => {
    const confirmed = await showConfirmToast({
      title: "Delete this expense?",
      description: "This action is permanent and cannot be undone.",
      confirmText: "Delete",
      cancelText: "Keep",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/accounts/expenses/${id}`);
      toast.success("Expense removed");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const profitLabel = useMemo(() => {
    if (!summary) return "Net Balance";
    return (summary.profitOrLoss || 0) >= 0 ? "Net Profit" : "Net Loss";
  }, [summary]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">Auditing Books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Accounts <span className="text-orange-500">Studio</span>
            </h2>
            <p className="text-slate-500 font-medium italic text-sm md:text-base">Real-time financial auditing and team payouts.</p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white px-8 py-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-6"
          >
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{profitLabel}</p>
              <p className={`text-3xl font-black ${(summary?.profitOrLoss || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                ₹{Math.abs(summary?.profitOrLoss || 0).toLocaleString()}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${(summary?.profitOrLoss || 0) >= 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
              {(summary?.profitOrLoss || 0) >= 0 ? <FaArrowTrendUp size={24} /> : <FaArrowTrendDown size={24} />}
            </div>
          </motion.div>
        </header>

        {/* Financial Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard title="Revenue" val={summary?.revenue} icon={<FaMoneyBillWave />} color="emerald" />
          <StatCard title="Wage Accrued" val={summary?.accruedDeliveryWages} icon={<FaWallet />} color="amber" />
          <StatCard title="Wage Paid" val={summary?.paidDeliveryWages} icon={<FaCircleCheckIcon />} color="blue" />
          <StatCard title="Payable" val={summary?.deliveryWagesPayable} icon={<FaArrowTrendDown />} color="rose" />
          <StatCard title="Manual Cost" val={summary?.manualExpenses} icon={<FaReceipt />} color="orange" />
          <StatCard title="Total Payout" val={summary?.totalExpenses} icon={<FaFileInvoiceDollar />} color="slate" />
        </div>

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Wage Ledger Section */}
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Wage Ledger</h3>
              <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">{wageLedger.length} Personnel</span>
            </div>
            
            <form onSubmit={handlePayWage} className="space-y-4 mb-10 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={wagePayForm.deliveryBoyId}
                  onChange={(e) => setWagePayForm((prev) => ({ ...prev, deliveryBoyId: e.target.value }))}
                  required
                  className="p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                >
                  <option value="">Select Personnel</option>
                  {wageLedger.map((row) => (
                    <option key={row.deliveryBoyId} value={row.deliveryBoyId}>
                      {row.name} (Due: ₹{Number(row.payable || 0).toFixed(0)})
                    </option>
                  ))}
                </select>
                <input
                  type="number" step="0.01" required placeholder="Amount (₹)"
                  value={wagePayForm.amount}
                  onChange={(e) => setWagePayForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  placeholder="Payment notes (e.g. Month End Bonus)..."
                  value={wagePayForm.notes}
                  onChange={(e) => setWagePayForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="flex-1 p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                />
                <button type="submit" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all active:scale-95 shadow-xl">
                  Release Payment
                </button>
              </div>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence>
                {wageLedger.map((row) => (
                  <motion.div 
                    layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    key={row.deliveryBoyId} 
                    className="p-5 rounded-3xl bg-white border border-slate-100 flex justify-between items-center group hover:border-orange-200 transition-all shadow-sm"
                  >
                    <div>
                      <p className="font-black text-slate-900">{row.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight mt-0.5">{row.deliveredCount} Orders Fulfilled</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-rose-500 tracking-tight">Owed: ₹{Number(row.payable || 0).toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-emerald-600 uppercase mt-0.5">Paid: ₹{Number(row.paid || 0).toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {/* Expense Tracker Section */}
          <section className="bg-white rounded-[2.5rem] border border-slate-200 p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Expense Tracker</h3>
              <FaReceipt className="text-slate-200" size={24} />
            </div>
            
            <form onSubmit={handleCreateExpense} className="space-y-4 mb-10 bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  required placeholder="Title (e.g. Gas Bill)"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                />
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                >
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <input
                  type="number" step="0.01" required placeholder="Amount (₹)"
                  value={form.amount}
                  onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                  className="p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm"
                />
                <input
                  type="date" required
                  value={form.expenseDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, expenseDate: e.target.value }))}
                  className="p-4 rounded-2xl bg-white border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm shadow-sm text-slate-400"
                />
              </div>
              <button type="submit" className="w-full bg-orange-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 transition-all active:scale-[0.98] shadow-xl shadow-orange-100">
                Register Expense
              </button>
            </form>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {expenses.map((expense) => (
                <div key={expense._id} className="p-4 rounded-[1.5rem] bg-white border border-slate-100 flex justify-between items-center group hover:border-rose-100 transition-all shadow-sm">
                  <div className="space-y-0.5">
                    <p className="font-black text-slate-800 text-sm">{expense.title}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      {formatCategory(expense.category)} • {new Date(expense.expenseDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-black text-rose-600 text-sm">₹{Number(expense.amount).toLocaleString()}</p>
                    <button 
                      onClick={() => handleDeleteExpense(expense._id)}
                      className="p-2.5 bg-slate-50 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Analytics Section */}
        <section className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
          <div className="mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Category Distribution</h3>
            <p className="text-slate-400 text-xs font-medium italic mt-1">Breakdown of manual expenses by business category.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(summary?.categoryBreakdown || []).map((item) => (
              <div key={item._id} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex flex-col justify-between h-[150px] group hover:bg-white hover:border-orange-200 transition-all">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black text-slate-400 group-hover:text-orange-500 uppercase tracking-[0.2em]">{formatCategory(item._id)}</p>
                  <FaChevronRight size={10} className="text-slate-200" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{Number(item.total || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.count} Transactions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          
        </section>

      </div>
    </div>
  );
};

/* --- Refactored Sub-Components --- */

const StatCard = ({ title, val, icon, color }) => {
  const colors = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[2.2rem] border transition-all ${colors[color] || colors.slate}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white rounded-[1.2rem] shadow-sm text-slate-900">{icon}</div>
      </div>
      <p className="text-[9px] font-black uppercase tracking-[0.15em] opacity-60 leading-tight">{title}</p>
      <p className="text-xl font-black mt-1 tracking-tight">₹{Number(val || 0).toLocaleString()}</p>
    </motion.div>
  );
};

const FaCircleCheckIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path>
  </svg>
);

const formatCategory = (category) => {
  const found = CATEGORY_OPTIONS.find((option) => option.value === category);
  return found ? found.label : "Other";
};

export default AccountsControl;
