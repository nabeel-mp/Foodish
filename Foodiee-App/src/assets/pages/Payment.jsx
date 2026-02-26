import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStripeS, FaLock, FaMoneyBillWave } from "react-icons/fa";
import api from "../../api/axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Retrieve the order data passed from the Order page
  const orderData = location.state?.orderData;
  const singleProduct = location.state?.singleProduct;

  if (!orderData) {
    // If someone tries to access /payment directly without going through checkout
    navigate("/cart");
    return null;
  }

  // --- STRIPE PAYMENT HANDLER ---
  const handleStripePayment = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
    try {
      const response = await api.post("/orders/place-stripe", orderData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success && response.data.session_url) {
        // Redirect the user to the Stripe Checkout page
        window.location.replace(response.data.session_url);
      } else {
        alert("Failed to initiate Stripe payment.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Stripe payment error:", error);
      alert("Error connecting to payment gateway.");
      setIsProcessing(false);
    }
  };

  // --- CASH ON DELIVERY HANDLER (Optional) ---
  const handleCOD = async () => {
    const confirmOrder = window.confirm("Are you sure you want to place this order using Cash on Delivery?");
    if (!confirmOrder) {
      return; 
    }
    setIsProcessing(true);
    try {
      // Standard order placement for COD
      const codOrderData = { ...orderData, paymentMethod: "COD" };
      const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
      await api.post("/orders", codOrderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      navigate("/thankyou", { state: { orderData: codOrderData }, replace: true });
    } catch (error) {
      console.error("COD error:", error);
      alert("Failed to place COD order.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 flex justify-center items-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white max-w-lg w-full p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 text-center"
      >
        <div className="bg-yellow-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaLock className="text-yellow-500 text-3xl" />
        </div>
        
        <h2 className="text-3xl font-black text-gray-900 mb-2">Payment</h2>
        <p className="text-gray-500 mb-8 font-medium">
          Choose a payment method to complete your order of <span className="font-bold text-gray-900">₹{orderData.total.toFixed(2)}</span>
        </p>

        <div className="space-y-4">
          {/* Stripe Button */}
          <button
            onClick={handleStripePayment}
            disabled={isProcessing}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-3 shadow-md ${
              isProcessing ? "bg-indigo-400 text-white cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200"
            }`}
          >
            
            <span>{isProcessing ? "Processing..." : "Pay with UPI / Credit Card"}</span>
          </button>

          <div className="flex items-center my-6">
             <div className="flex-1 h-px bg-gray-200"></div>
             <span className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">OR</span>
             <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Cash on Delivery Button */}
          <button
            onClick={handleCOD}
            disabled={isProcessing}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-3 border-2 ${
              isProcessing ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed" : "bg-white text-gray-800 border-gray-200 hover:border-gray-900"
            }`}
          >
            <span>Cash on Delivery</span>
          </button>
        </div>

        <p className="mt-8 text-xs text-gray-400 flex items-center justify-center">
          <FaLock className="mr-1" /> Payments are secure and encrypted
        </p>
      </motion.div>
    </div>
  );
};

export default Payment;
