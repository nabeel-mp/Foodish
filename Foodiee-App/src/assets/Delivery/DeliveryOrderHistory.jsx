import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FaClipboardList } from 'react-icons/fa';

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
    return <div className="pt-28 text-center text-gray-500 font-bold">Loading order history...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          <FaClipboardList className="text-yellow-500" /> Delivered Order History
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-sm font-bold text-gray-600">Order ID</th>
                <th className="p-4 text-sm font-bold text-gray-600">Customer</th>
                <th className="p-4 text-sm font-bold text-gray-600">Address</th>
                <th className="p-4 text-sm font-bold text-gray-600">Amount</th>
                <th className="p-4 text-sm font-bold text-gray-600">Payment</th>
                <th className="p-4 text-sm font-bold text-gray-600">Delivered At</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100">
                  <td className="p-4 font-semibold text-gray-800">#{order._id.slice(-8)}</td>
                  <td className="p-4 text-gray-700">{order.name || order.userId?.name || 'Customer'}</td>
                  <td className="p-4 text-gray-600">{order.address}</td>
                  <td className="p-4 font-semibold text-green-700">Rs. {Number(order.total || 0).toFixed(2)}</td>
                  <td className="p-4 text-gray-700">{order.paymentMethod || 'N/A'}</td>
                  <td className="p-4 text-gray-600">{new Date(order.updatedAt || order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No delivered orders yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrderHistory;
