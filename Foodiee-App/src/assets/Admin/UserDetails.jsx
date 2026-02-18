import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaCalendarAlt, FaBoxOpen, FaArrowLeft } from "react-icons/fa";
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

  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>;
  if (!userData) return <div className="p-10 text-center text-red-500">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Users
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{userData.name}</h2>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold uppercase tracking-wide">
                {userData.role || "Customer"}
              </span>

              <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-4 text-gray-600 p-3 bg-gray-50 rounded-xl">
                  <FaEnvelope className="text-yellow-500" />
                  <div className="text-sm">
                    <p className="text-xs text-gray-400 uppercase">Email</p>
                    {userData.email}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-gray-600 p-3 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-yellow-500" />
                  <div className="text-sm">
                    <p className="text-xs text-gray-400 uppercase">Joined</p>
                    {new Date(userData.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FaBoxOpen className="text-yellow-500" /> Order History
                </h3>
                <span className="text-sm text-gray-400">{orders.length} Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No orders placed yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-600">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono text-xs text-gray-400">#{order._id.slice(-6)}</td>
                          <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-4 font-medium text-gray-900">₹{order.total}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDetails;