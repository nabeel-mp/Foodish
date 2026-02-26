import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaShoppingBag, 
  FaHeart, 
  FaArrowLeft, 
  FaMapMarkerAlt, 
  FaCreditCard 
} from "react-icons/fa";
import api from "../../api/axios";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orderedItemCount, setOrderedItemCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          api.get(`/admin/users/${userId}`),
          api.get(`/orders?userId=${userId}`)
        ]);

        // Accessing data correctly from the axios response
        const userData = userRes.data;
        const ordersData = ordersRes.data;

        // ROLE CHECK: Only allow 'user' role, reject 'delivery'
        if (userData && userData.role === 'user') {
          setUser(userData);
          setOrders(ordersData);

          // Calculate total items ordered
          const count = ordersData.reduce(
            (total, order) =>
              total + order.items.reduce((sum, item) => sum + item.quantity, 0),
            0
          );
          setOrderedItemCount(count);
        } else {
          // If role is delivery or something else, don't set user state
          setUser(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500"></div>
      </div>
    );
  }

  // This block will trigger if user doesn't exist OR if they were filtered out by role
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">Customer profile not found!</h2>
        <p className="text-gray-500 mt-2">This ID may belong to a delivery partner or no longer exists.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="mt-6 px-6 py-2 bg-yellow-500 text-white rounded-full font-bold hover:bg-yellow-600 transition-all"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* --- Header / Back Button --- */}
        <button
          onClick={() => navigate("/admin/users")}
          className="flex items-center gap-2 text-gray-500 hover:text-yellow-600 font-semibold mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Customer List
        </button>

        {/* --- Profile Card --- */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-32 relative"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="mb-1">
                  <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                  <div className="flex items-center gap-2 text-gray-500">
                    <FaEnvelope className="text-sm" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide border ${user.status === 'active' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                {user.status || 'Active'}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-6">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-yellow-500">
                  <FaShoppingBag size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-yellow-500">
                  <FaUtensilsIcon />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Dishes Ordered</p>
                  <p className="text-xl font-bold text-gray-900">{orderedItemCount}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-red-400">
                  <FaHeart size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-xs font-bold uppercase">Wishlist</p>
                  <p className="text-xl font-bold text-gray-900">{user.wishlist?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Order History Section --- */}
        <h3 className="text-xl font-bold text-gray-900 mb-5 pl-2 border-l-4 border-yellow-500">Order History</h3>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <p className="text-gray-400 text-lg">No orders found for this customer.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id || order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">

                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100 gap-3">
                  <div className="flex gap-4 items-center">
                    <span className="font-bold text-gray-800">#{order.id || order._id}</span>
                    <span className="text-gray-400 text-sm">|</span>
                    <span className="text-gray-500 text-sm">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent Order"}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                    {order.status || 'Processing'}
                  </span>
                </div>

                {/* Order Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex gap-3">
                      <FaMapMarkerAlt className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Delivery Address</p>
                        <p className="text-gray-800 text-sm leading-relaxed">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <FaCreditCard className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Payment</p>
                        <p className="text-gray-800 text-sm font-medium">{order.paymentMethod || 'Cash on Delivery'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Items Ordered</h4>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                            <span className="text-gray-700 font-medium">{item.title}</span>
                            <span className="text-gray-400 text-xs">x{item.quantity}</span>
                          </div>
                          <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-700">Total Amount</span>
                      <span className="font-extrabold text-xl text-yellow-600">₹{order.total || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FaUtensilsIcon = () => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
    <path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 1.5c-30 1.8-53 24.8-53 54.8V448c0 17.7 14.3 32 32 32s32-14.3 32-32V160h208c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H64z"></path>
  </svg>
);

export default UserDetails;