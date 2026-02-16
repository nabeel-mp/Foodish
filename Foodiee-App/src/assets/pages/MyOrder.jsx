
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaBasketShopping } from "react-icons/fa6";
import api from "../../api/axios";

const MyOrder = () => {
  const { user } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders");
        const userOrders = res.data
          .filter((order) => order.userId === user.id)
          .sort((a, b) => b.id - a.id);
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) {
     return (
         <div className="my-orders-empty">
             <h2>Please log in to view orders</h2>
             <button onClick={() => navigate("/login")}>Login</button>
         </div>
     )
  }

  return (
      
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <h1 className="text-4xl font-bold text-center mt-20 mb-10 text-yellow-400">My Orders</h1>
      {orders.length === 0 ? (
          <div className="bg-transparent relative top-40">
        <FaBasketShopping size={80} className="text-center text-yellow-500 ml-142"/>
        <br />
        <p className="text-center text-yellow-400 font-semibold text-3xl">You not Order Any Items</p>
        <p className="text-center text-gray-400 font-mono text-xl mt-2">You have not placed any orders yet.</p>
        </div>
      ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
          {orders.map((order) => (
              <div key={order.id} className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2 text-yellow-300">
                Order #{order.id}
              </h2>
              <p className="mb-2 text-sm text-gray-400"> Date: {order.date}</p>
              <p className="mb-2"> Payment: <span className="text-green-400">{order.paymentMethod || "N/A"}</span></p>
              <p className="mb-2"> Address: <span className="text-blue-300">{order.address || "Not provided"}</span></p>
              <p className="mb-2"> Name: <span className="text-blue-300">{order.name || "Not provided"}</span></p>
              <p className="mb-2"> Phone Number: <span className="text-blue-300">{order.phone || "Not provided"}</span></p>
              <p className="mb-2 font-semibold"> Status: <span className="text-yellow-300">{order.status}</span></p>
              <p className="mb-4 font-bold"> Total: ₹{order.total.toFixed(2)}</p>

              <div className="border-t border-gray-600 pt-4">
                <h3 className="font-semibold mb-2"> Items:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm mb-4">
                  {(order.items || []).map((item, index) => (
                    <li key={index}>
                      {item.title} x {item.quantity} — ₹{(item.price * item.quantity).toFixed(2)}
                    </li>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrder;

