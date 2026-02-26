import React, { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { FaMoneyBillWave, FaTrash, FaPlus } from "react-icons/fa";

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
  const [wagePayForm, setWagePayForm] = useState({
    deliveryBoyId: "",
    amount: "",
    notes: ""
  });
  const [form, setForm] = useState({
    title: "",
    category: "groceries",
    amount: "",
    notes: "",
    expenseDate: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [summaryRes, expensesRes] = await Promise.all([
        api.get("/admin/accounts/summary"),
        api.get("/admin/accounts/expenses")
      ]);
      setSummary(summaryRes.data?.data || null);
      setExpenses(expensesRes.data?.data || []);
      const wagesRes = await api.get("/admin/accounts/wages");
      setWageLedger(wagesRes.data?.data || []);
    } catch (error) {
      toast.error("Failed to load accounts data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Adding expense...");
    try {
      await api.post("/admin/accounts/expenses", {
        ...form,
        amount: Number(form.amount)
      });
      toast.success("Expense added", { id: loadingToast });
      setForm({ title: "", category: "groceries", amount: "", notes: "", expenseDate: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add expense", { id: loadingToast });
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await api.delete(`/admin/accounts/expenses/${id}`);
      toast.success("Expense deleted");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const handlePayWage = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Recording wage payment...");
    try {
      await api.post("/admin/accounts/wages/pay", {
        ...wagePayForm,
        amount: Number(wagePayForm.amount)
      });
      toast.success("Wage payment recorded", { id: loadingToast });
      setWagePayForm({ deliveryBoyId: "", amount: "", notes: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to record wage payment", { id: loadingToast });
    }
  };

  const profitLabel = useMemo(() => {
    if (!summary) return "Profit / Loss";
    return summary.profitOrLoss >= 0 ? "Profit" : "Loss";
  }, [summary]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500 font-bold">Loading accounts...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <FaMoneyBillWave className="text-green-600 text-2xl" />
          <h2 className="text-3xl font-black text-gray-900">Accounts Control</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
          <Card title="Revenue" value={summary?.revenue} tone="green" />
          <Card title="Wages Accrued" value={summary?.accruedDeliveryWages} tone="amber" />
          <Card title="Wages Paid" value={summary?.paidDeliveryWages} tone="orange" />
          <Card title="Wages Payable" value={summary?.deliveryWagesPayable} tone="red" />
          <Card title="Manual Expenses" value={summary?.manualExpenses} tone="orange" />
          <Card title="Total Expenses (Paid)" value={summary?.totalExpenses} tone="red" />
          <Card title={profitLabel} value={Math.abs(summary?.profitOrLoss || 0)} tone={(summary?.profitOrLoss || 0) >= 0 ? "green" : "red"} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Delivery Wage Payment (Manual)</h3>
          <form onSubmit={handlePayWage} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <select
              value={wagePayForm.deliveryBoyId}
              onChange={(e) => setWagePayForm((prev) => ({ ...prev, deliveryBoyId: e.target.value }))}
              required
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select delivery personnel</option>
              {wageLedger.map((row) => (
                <option key={row.deliveryBoyId} value={row.deliveryBoyId}>
                  {row.name} (Payable: Rs. {Number(row.payable || 0).toFixed(2)})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={wagePayForm.amount}
              onChange={(e) => setWagePayForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Payment amount"
              required
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={wagePayForm.notes}
              onChange={(e) => setWagePayForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              Record Payment
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b">
                  <th className="py-3">Delivery Boy</th>
                  <th>Delivered</th>
                  <th>Accrued</th>
                  <th>Paid</th>
                  <th>Payable</th>
                </tr>
              </thead>
              <tbody>
                {wageLedger.map((row) => (
                  <tr key={row.deliveryBoyId} className="border-b border-gray-50">
                    <td className="py-3 font-semibold text-gray-800">{row.name}</td>
                    <td className="text-gray-700">{row.deliveredCount}</td>
                    <td className="font-bold text-amber-700">Rs. {Number(row.accrued || 0).toFixed(2)}</td>
                    <td className="font-bold text-green-700">Rs. {Number(row.paid || 0).toFixed(2)}</td>
                    <td className="font-bold text-red-700">Rs. {Number(row.payable || 0).toFixed(2)}</td>
                  </tr>
                ))}
                {wageLedger.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 font-semibold">No delivery wage records yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Add Expense</h3>
          <form onSubmit={handleCreateExpense} className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Expense title"
              required
              className="md:col-span-2 p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            >
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount"
              required
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              type="date"
              value={form.expenseDate}
              onChange={(e) => setForm((prev) => ({ ...prev, expenseDate: e.target.value }))}
              className="p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <input
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes (optional)"
              className="md:col-span-4 p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-orange-500 text-white p-3 rounded-xl font-bold hover:bg-orange-600 transition-colors"
            >
              <FaPlus /> Add
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expenses List</h3>
            <table className="w-full min-w-[680px] text-left">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b">
                  <th className="py-3">Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id} className="border-b border-gray-50">
                    <td className="py-3 font-semibold text-gray-800">{expense.title}</td>
                    <td className="text-gray-600">{formatCategory(expense.category)}</td>
                    <td className="font-bold text-red-600">Rs. {Number(expense.amount).toFixed(2)}</td>
                    <td className="text-gray-600">{new Date(expense.expenseDate).toLocaleDateString()}</td>
                    <td className="text-right">
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold"
                      >
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 font-semibold">No expenses recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Breakdown</h3>
            <div className="space-y-3">
              {(summary?.categoryBreakdown || []).map((item) => (
                <div key={item._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{formatCategory(item._id)}</p>
                    <p className="text-xs text-gray-500">{item.count} entries</p>
                  </div>
                  <p className="text-sm font-black text-gray-900">Rs. {Number(item.total || 0).toFixed(2)}</p>
                </div>
              ))}
              {(summary?.categoryBreakdown || []).length === 0 && (
                <p className="text-gray-400 font-semibold">No category data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, tone }) => {
  const toneClass = {
    green: "bg-green-50 text-green-700 border-green-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    red: "bg-red-50 text-red-700 border-red-100"
  }[tone] || "bg-gray-50 text-gray-700 border-gray-100";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <p className="text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black mt-2">Rs. {Number(value || 0).toFixed(2)}</p>
    </div>
  );
};

const formatCategory = (category) => {
  const found = CATEGORY_OPTIONS.find((option) => option.value === category);
  return found ? found.label : "Other";
};

export default AccountsControl;
