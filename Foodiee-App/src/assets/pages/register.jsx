import React, { useState, useContext } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from "react-icons/fa";

const Register = () => {
  const { registerUser } = useContext(StoreContext);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError(""); // Clear error on type

    // Real-time Name Validation (Characters only)
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) return;
    }

    setUserData({ ...userData, [name]: value });
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { name, email, password } = userData;

    // Final Validations
    if (!name || !email || !password) {
      setError("All fields are required");
      setIsSubmitting(false);
      return;
    }

    if (name.trim().length < 3) {
      setError("Please enter a valid full name (min 3 characters)");
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsSubmitting(false);
      return;
    }

    const uppercase = /[A-Z]/;
    const symbol = /[!@#$%^&*(),.?":{}|<>]/;

    if (!uppercase.test(password)) {
      setError("Include at least one uppercase letter");
      setIsSubmitting(false);
      return;
    }

    if (!symbol.test(password)) {
      setError("Include at least one special symbol");
      setIsSubmitting(false);
      return;
    }

    const success = await registerUser(userData);

    if (success) {
      navigate("/login");
    } else {
      setError("Email already exists. Please try logging in.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 pt-20 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 w-full max-w-md border border-gray-100"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
            Join <span className="text-yellow-500">Us!</span>
          </h2>
          <p className="text-gray-500 font-medium">Create an account to start ordering.</p>
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

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">Full Name</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                value={userData.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-2 mb-2 block tracking-widest">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                required
                value={userData.email}
                onChange={handleChange}
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
                name="password"
                placeholder="••••••••"
                required
                value={userData.password}
                onChange={handleChange}
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full font-black bg-gray-900 text-white py-5 rounded-2xl shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-yellow-500 hover:shadow-yellow-100"
            }`}
          >
            <span>{isSubmitting ? "Creating Account..." : "Register"}</span>
            {!isSubmitting && <FaArrowRight className="text-sm" />}
          </button>
        </form>

        <p className="text-sm mt-8 text-center font-medium text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-yellow-600 font-black hover:underline underline-offset-4">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;