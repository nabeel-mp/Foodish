import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const ThankYou = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 pt-20 pb-10">
      <div className="max-w-2xl w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-16 text-center"
        >
          {/* Animated Success Icon */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 text-5xl"
          >
            <FaCheckCircle />
          </motion.div>

          {/* Text Content */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight"
          >
            Success<span className="text-yellow-500">!</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-500 font-medium mb-2"
          >
            Your order has been placed successfully.
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-400"
          >
            Order ID: <span className="font-bold text-gray-600">#{orderData?.id || Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
          </motion.p>

          <div className="mt-12 space-y-4">
            <Link to="/my-orders" className="block">
              <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:bg-yellow-500 transition-all transform active:scale-95 shadow-lg">
                <FaShoppingBag className="text-sm" />
                <span>Track My Order</span>
              </button>
            </Link>

            <Link to="/menu" className="block">
              <button className="w-full bg-white text-gray-600 py-4 rounded-2xl font-bold border border-gray-100 hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 group">
                <span>Continue Ordering</span>
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Support Note */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-gray-400 text-sm"
        >
          Need help with your order? <Link to="/contact" className="text-yellow-600 font-bold hover:underline">Contact Support</Link>
        </motion.p>
      </div>
    </div>
  );
};

export default ThankYou;