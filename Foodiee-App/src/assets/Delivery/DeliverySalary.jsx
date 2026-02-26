import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FaMoneyBillWave, FaTruck } from 'react-icons/fa';

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
    return <div className="pt-28 text-center text-gray-500 font-bold">Loading salary details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <FaMoneyBillWave className="text-green-600" /> Salary Summary
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold mb-2">Wage Per Delivery</p>
            <p className="text-3xl font-black text-gray-900">Rs. {summary?.wagePerDelivery || 25}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold mb-2">Total Delivered Orders</p>
            <p className="text-3xl font-black text-gray-900 flex items-center gap-2">
              <FaTruck className="text-yellow-500" /> {summary?.totalDelivered || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold mb-2">This Month Salary</p>
            <p className="text-3xl font-black text-green-700">Rs. {summary?.monthSalary || 0}</p>
            <p className="text-sm text-gray-500 mt-1">From {summary?.monthDelivered || 0} deliveries</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 font-semibold mb-2">Total Salary</p>
            <p className="text-3xl font-black text-green-700">Rs. {summary?.totalSalary || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverySalary;
