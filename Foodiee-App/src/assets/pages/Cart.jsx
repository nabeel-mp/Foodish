import React, { useContext } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(StoreContext);
  const navigate = useNavigate();

  // Calculate total safely
  const totalPrice = cartItems.reduce((acc, item) => {
    return acc + (Number(item.price) * Number(item.quantity));
  }, 0);

  if (!cartItems.length) {
    return (
      <div className="min-h-screen pt-24 text-center bg-gray-900 text-white">
        <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
        <button 
          onClick={() => navigate('/menu')}
          className="bg-yellow-400 text-black px-6 py-2 rounded font-bold"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4 sm:px-8 text-white">
      <h2 className="text-3xl font-bold text-center mb-8 text-yellow-400">Your Cart</h2>
      
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Cart Items List */}
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-4">
                <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="text-xl font-semibold">{item.title}</h3>
                  <p className="text-gray-400">Price: ₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-700 rounded px-2">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2 hover:text-yellow-400"><FaMinus size={12}/></button>
                  <span className="px-2 font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2 hover:text-yellow-400"><FaPlus size={12}/></button>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)} 
                  className="text-red-500 hover:text-red-400 p-2"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
          <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span>Delivery Fee</span>
            <span>₹40</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-yellow-400 mb-6">
            <span>Total</span>
            <span>₹{totalPrice + 40}</span>
          </div>
          <button
            onClick={() => navigate("/order")}
            className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;