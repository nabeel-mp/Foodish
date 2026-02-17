import React, { useContext } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useContext(StoreContext);
  const navigate = useNavigate();

  // --- Calculation Logic ---
  const subtotal = cartItems.reduce((acc, item) => {
    return acc + Number(item.price) * Number(item.quantity);
  }, 0);

  const deliveryFee = subtotal > 0 ? 25 : 0;
  const CGST = subtotal * 0.02; // 2%
  const SGST = subtotal * 0.02; // 2%
  const totalAmount = subtotal + deliveryFee + CGST + SGST;

  const handleQuantityChange = (id, newQuantity, currentQuantity) => {
    if (newQuantity > 5) {
      alert("Maximum 5 quantities allowed per item.");
      return;
    }
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center bg-gray-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50">
            <FaShoppingBag className="mx-auto text-gray-200 text-7xl mb-6" />
            <h2 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added any delicious meals yet.</p>
            <button 
              onClick={() => navigate('/menu')}
              className="bg-yellow-500 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-yellow-200 hover:bg-yellow-600 transition-all active:scale-95"
            >
              Start Ordering
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end space-x-4 mb-10">
          <h2 className="text-4xl font-black text-gray-900">My <span className="text-yellow-500">Cart</span></h2>
          <span className="text-gray-400 font-medium mb-1">({cartItems.length} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* List of Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item._id || item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-5 rounded-3xl flex items-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl shadow-inner" 
                  />
                  
                  <div className="flex-grow px-4 md:px-8">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">{item.title}</h3>
                    <p className="text-yellow-600 font-bold mb-3">₹{item.price}</p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-100 p-1">
                        <button 
                          onClick={() => handleQuantityChange(item._id || item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-gray-500"
                        >
                          <FaMinus size={10}/>
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item._id || item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors text-gray-500"
                        >
                          <FaPlus size={10}/>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-24 md:h-32">
                    <button 
                      onClick={() => removeFromCart(item._id || item.id)} 
                      className="text-gray-300 hover:text-red-500 transition-colors p-2"
                    >
                      <FaTrash size={18} />
                    </button>
                    <p className="text-lg font-black text-gray-900">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Bill Details */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/40 border border-gray-50 sticky top-28">
              <h3 className="text-xl font-black mb-6 text-gray-900">Bill Details</h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">₹{deliveryFee}</span>
                </div>
                <div className="pt-4 border-t border-dashed border-gray-200 space-y-3">
                  <div className="flex justify-between text-xs uppercase tracking-wider">
                    <span>CGST (2%)</span>
                    <span>₹{CGST.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs uppercase tracking-wider">
                    <span>SGST (2%)</span>
                    <span>₹{SGST.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-gray-900">To Pay</span>
                  <span className="text-3xl font-black text-yellow-500">₹{totalAmount.toFixed(2)}</span>
                </div>
                
                <button
                  onClick={() => navigate("/order")}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-yellow-500 hover:shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-3"
                >
                  <span>Proceed to Checkout</span>
                </button>
                
                <p className="text-[10px] text-gray-400 text-center mt-4 uppercase tracking-widest font-medium">
                  Safe and Secure Payments
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;