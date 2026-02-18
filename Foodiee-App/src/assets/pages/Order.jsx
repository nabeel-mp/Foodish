import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaUser, FaArrowRight } from "react-icons/fa";

const Order = () => {
  const { user, cartItems } = useContext(StoreContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [singleProduct, setSingleProduct] = useState(null);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const savedAddress = localStorage.getItem("deliverAddress");
    if (savedAddress) {
      setUserData((prev) => ({ ...prev, address: savedAddress }));
    }

    if (location.state && location.state.singleProduct) {
      const productFromLocation = location.state.singleProduct;
      setSingleProduct({
        ...productFromLocation,
        quantity: productFromLocation.quantity || 1,
      });
    }
  }, [location, user, navigate]);

  const items = singleProduct ? [singleProduct] : cartItems;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Bill Calculations
  const CGST = subtotal * 0.02;
  const SGST = subtotal * 0.02;
  const deliverycharge = subtotal > 0 ? 25 : 0;
  const total = subtotal + CGST + SGST + deliverycharge;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(""); // Clear error when typing

    // Strict Validations while typing
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return; // Only characters
    }
    if (name === "phone") {
      if (!/^\d*$/.test(value) || value.length > 10) return; // Only numbers, max 10
    }
    if (name === "address") {
      if (!/^[a-zA-Z0-9\s,.-]*$/.test(value)) return; // No special characters except basic punctuation
    }

    setUserData({ ...userData, [name]: value });
  };

  const proceedToPayment = (e) => {
    e.preventDefault();
    const { name, address, phone } = userData;

    // Final Validation Check
    if (!name || !address || !phone) {
      setError("Please fill in all delivery details.");
      return;
    }
    if (name.trim().length < 3) {
      setError("Please enter a valid full name.");
      return;
    }
    if (phone.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (address.trim().length < 15) {
      setError("Address is too short (minimum 15 characters).");
      return;
    }

    localStorage.setItem("deliverAddress", address);

    const orderData = {
      userId: user.id, // Or user._id based on your backend
      items,
      name,
      phone,
      total,
      address,
      subtotal,
      tax: CGST + SGST,
      deliverycharge,
      status: "Payment Pending",
      date: new Date().toLocaleString(),
    };

    // Navigate to the new payment page and pass the order data
    navigate("/payment", { state: { orderData, singleProduct }, replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center space-x-4 mb-10">
          <h2 className="text-4xl font-black text-gray-900">Checkout</h2>
          <div className="h-1 w-20 bg-yellow-500 rounded-full hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Side: Delivery Form */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <FaMapMarkerAlt className="text-yellow-500 mr-3" /> Delivery Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block">Full Name</label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={userData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block">Phone Number</label>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="10-digit number"
                      value={userData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block">Complete Address</label>
                  <textarea
                    name="address"
                    placeholder="Flat No, Building, Street Name, Area..."
                    value={userData.address}
                    onChange={handleChange}
                    className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
                    rows={3}
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-red-500 text-sm font-bold bg-red-50 p-3 rounded-xl text-center border border-red-100">
                  {error}
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Right Side: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-28">
              <h3 className="text-xl font-black text-gray-900 mb-6">Order Summary</h3>
              
              <div className="max-h-48 overflow-y-auto mb-6 pr-2 space-y-4 no-scrollbar">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 font-medium">
                      <span className="text-gray-900 font-bold">{item.quantity}x</span> {item.title || item.name}
                    </span>
                    <span className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-gray-50 pt-6">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
                  <span>CGST + SGST (4%)</span>
                  <span>₹{(CGST + SGST).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-gray-900">₹{deliverycharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-lg font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-yellow-500">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={proceedToPayment}
                className="w-full mt-8 py-5 rounded-2xl font-black text-lg transition-all transform active:scale-95 flex items-center justify-center space-x-3 shadow-lg bg-gray-900 text-white hover:bg-yellow-500 hover:shadow-yellow-100"
              >
                <span>Proceed to Payment</span>
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;