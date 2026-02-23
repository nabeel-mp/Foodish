import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

const Login = () => {
  const { loginUser } = useContext(StoreContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role === "admin") {
          navigate("/admin/dashboard");
        } else if (parsedUser.role === "delivery") {
          navigate("/delivery")
        } 
        else {
          navigate("/");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!email || !password) {
      setError("Please enter both email and password");
      setIsSubmitting(false);
      return;
    }

    const success = await loginUser(email, password);

    if (success) {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (storedUser?.role === "delivery") {
        navigate("/delivery")
      }
      else {
        navigate("/");
      }
    } else {
      setError("Invalid email or password.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 pt-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100"
      >
        {/* Brand/Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Welcome <span className="text-yellow-500">Back!</span>
          </h2>
          <p className="text-gray-500 font-medium">Log in to satisfy your cravings.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 text-red-500 text-sm font-bold p-4 rounded-2xl mb-6 text-center border border-red-100"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forgot-password" size="xs" className="text-xs font-bold text-gray-400 hover:text-yellow-600 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-black bg-gray-900 text-white py-5 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-yellow-500 hover:shadow-yellow-100"
            }`}
          >
            <span>{isSubmitting ? "Verifying..." : "Login"}</span>
            {!isSubmitting && <FaArrowRight className="text-sm" />}
          </button>
        </form>

        <p className="text-sm mt-8 text-center font-medium text-gray-500">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-600 font-black hover:underline underline-offset-4">
            Register Now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;