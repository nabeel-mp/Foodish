import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./foodiee.jpeg";
import { StoreContext } from "../storecontext/StoreContext";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { 
  FaCartShopping, 
  FaBasketShopping, 
  FaHouse, 
  FaUtensils, 
  FaCircleInfo // Changed from FaInfoCircle
} from "react-icons/fa6";
import { IoMdHeart, IoMdContact } from "react-icons/io";
import { 
  FaRoute, 
  FaTruck, 
  FaClipboardList, 
  FaMoneyBillWave 
} from "react-icons/fa6"; // Standardized to fa6 for consistency

const Navbar = () => {
  const { user, logout, cartItems, wishlist } = useContext(StoreContext);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  // Navigation configurations with corrected icon names
  const userLinks = [
    { path: "/", label: "Home", icon: <FaHouse size={20} /> },
    { path: "/menu", label: "Menu", icon: <FaUtensils size={20} /> },
    { path: "/about", label: "About", icon: <FaCircleInfo size={20} /> },
    { path: "/contact", label: "Contact", icon: <IoMdContact size={22} /> },
  ];

  const deliveryLinks = [
    { path: "/delivery", label: "Dashboard", icon: <FaTruck size={20} /> },
    { path: "/delivery-tracking", label: "Tracking", icon: <FaRoute size={20} /> },
    { path: "/delivery-history", label: "History", icon: <FaClipboardList size={20} /> },
    { path: "/delivery-salary", label: "Salary", icon: <FaMoneyBillWave size={20} /> },
  ];

  const currentLinks = user?.role === "delivery" ? deliveryLinks : userLinks;

  return (
    <>
      {/* --- TOP FIXED HEADER --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white/90 backdrop-blur-xl shadow-md py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <motion.img
              whileHover={{ rotate: 10, scale: 1.05 }}
              src={Logo}
              alt="Foodish"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shadow-md border-2 border-white"
            />
            <span className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
              food<span className="text-yellow-500">ish.</span>
            </span>
          </Link>

          {/* Desktop Navigation (Hidden on Mobile) */}
          <ul className="hidden md:flex gap-8 items-center font-semibold text-gray-700">
            {currentLinks.map((link) => (
              <li key={link.path} className="relative group">
                <Link
                  to={link.path}
                  className={`transition-colors duration-300 ${
                    isActive(link.path) ? "text-yellow-500" : "hover:text-yellow-500"
                  }`}
                >
                  {link.label}
                </Link>
                {isActive(link.path) && (
                  <motion.div
                    layoutId="desktopUnderline"
                    className="absolute -bottom-1 left-0 h-[2px] bg-yellow-500 w-full rounded-full"
                  />
                )}
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {user && user.role !== "delivery" && (
              <div className="hidden md:flex items-center gap-6 mr-4">
                <Link to="/cart" className="relative text-gray-700 hover:text-yellow-500">
                  <FaCartShopping size={22} />
                  {cartItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-[10px] text-white rounded-full h-4 w-4 flex items-center justify-center border border-white">
                      {cartItems.length}
                    </span>
                  )}
                </Link>
                <Link to="/wishlist" className="text-gray-700 hover:text-red-500">
                  <IoMdHeart size={24} />
                </Link>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                <span className="hidden sm:inline text-gray-800 font-medium text-sm">
                  Hi, <span className="text-yellow-500 font-bold">{user.name.split(' ')[0]}</span>
                </span>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RiAccountPinCircleFill size={34} className="text-gray-300 hover:text-red-500 transition-colors" />
                </motion.button>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-yellow-500 text-white font-bold px-6 py-2 rounded-full shadow-lg text-sm">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-4 py-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center h-12">
          {currentLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex flex-col items-center gap-1 flex-1 transition-colors ${
                isActive(link.path) ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              {link.icon}
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {link.label}
              </span>
              {isActive(link.path) && (
                <motion.div 
                  layoutId="mobileIndicator"
                  className="w-1 h-1 bg-yellow-500 rounded-full mt-0.5" 
                />
              )}
            </Link>
          ))}

          {/* Cart specifically for User mobile view */}
          {user && user.role !== "delivery" && (
            <Link
              to="/cart"
              className={`flex flex-col items-center gap-1 flex-1 ${isActive("/cart") ? "text-yellow-500" : "text-gray-400"}`}
            >
              <div className="relative">
                <FaCartShopping size={20} />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-yellow-500 text-[8px] text-white rounded-full h-3.5 w-3.5 flex items-center justify-center font-bold">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">Cart</span>
            </Link>
          )}
        </div>
      </nav>
      
      {/* Mobile Spacer */}
      <div className="md:hidden h-20"></div>
    </>
  );
};

export default Navbar;