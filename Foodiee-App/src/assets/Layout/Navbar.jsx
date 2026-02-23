import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./foodiee.jpeg";
import { StoreContext } from "../storecontext/StoreContext";
import { RiAccountPinCircleFill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { FaCartShopping, FaBasketShopping } from "react-icons/fa6";
import { IoMdHeart } from "react-icons/io";
import { FaRoute , FaTruck } from "react-icons/fa";

const Navbar = () => {
  const { user, logout, cartItems, wishlist } = useContext(StoreContext);
  const [menuOpen, setMenuOpen] = useState(false);
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
    const confirmLogout = window.confirm("Are you sure you want to logout?");

    if (confirmLogout) {
      logout();
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "bg-white/70 backdrop-blur-xl shadow-sm py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <motion.img
            whileHover={{ rotate: 10, scale: 1.05 }}
            src={Logo}
            alt="Foodiee"
            className="w-11 h-11 rounded-full object-cover shadow-md border-2 border-white"
          />
          <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
            food<span className="text-yellow-500">ish.</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex gap-8 items-center font-semibold text-gray-700">
          {user?.role !== "delivery" && navLinks.map((link) => (
            <li key={link.path} className="relative group cursor-pointer">
              <Link
                to={link.path}
                className={`transition-colors duration-300 ${isActive(link.path) ? "text-yellow-500" : "hover:text-yellow-500"
                  }`}
              >
                {link.label}
              </Link>
              {/* Animated Underline */}
              <motion.div
                className="absolute -bottom-1 left-0 h-[2px] bg-yellow-500 rounded-full"
                initial={{ width: isActive(link.path) ? "100%" : "0%" }}
                animate={{ width: isActive(link.path) ? "100%" : "0%" }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute -bottom-1 left-0 h-[2px] bg-yellow-500 rounded-full w-0 group-hover:w-full transition-all duration-300 opacity-50" />
            </li>
          ))}

          {user?.role === "delivery" && (
            <>
              <Link to="/delivery" className={`flex items-center gap-2 ${isActive("/delivery") ? "text-yellow-500" : ""}`}>
                <FaTruck /> Dashboard
              </Link>
              <Link to="/delivery-tracking" className={`flex items-center gap-2 ${isActive("/delivery-tracking") ? "text-yellow-500" : ""}`}>
                <FaRoute /> Tracking
              </Link>
            </>
          )}
        </ul>

        {/* Right Side Icons & Auth (Desktop) */}
        <div className="hidden md:flex items-center gap-7">
          {user && (
            <>
              {user.role !== "delivery" && (
                <>
                  {/* Cart Icon */}
                  <Link to="/cart" className="relative text-gray-700 hover:text-yellow-500 transition-colors">
                    <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                      <FaCartShopping size={24} />
                    </motion.div>
                    <AnimatePresence>
                      {cartItems?.length > 0 && (
                        <motion.span
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm"
                        >
                          {cartItems.length}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>

                  {/* Wishlist Icon */}
                  <Link to="/wishlist" className="relative text-gray-700 hover:text-red-500 transition-colors">
                    <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                      <IoMdHeart size={26} />
                    </motion.div>
                    <AnimatePresence>
                      {wishlist?.length > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold text-white rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-sm"
                        >
                          {wishlist.length}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
              {/* Orders Icon */}
              <Link to="/myorders" className={`text-gray-700 hover:text-yellow-500 transition-colors ${isActive("/myorders") ? "text-yellow-500" : ""}`}>
                <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <FaBasketShopping size={24} />
                </motion.div>
              </Link>
                </>
              )}



              {/* Profile/Logout */}
              <div className="flex items-center gap-3 border-l pl-5 border-gray-200">
                <span className="text-gray-800 font-medium text-sm">
                  Hi, <span className="text-yellow-500 font-bold">{user.name}</span>
                </span>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  title="Logout"
                >
                  <RiAccountPinCircleFill size={34} className="text-gray-300 hover:text-yellow-500 transition-colors shadow-sm rounded-full" />
                </motion.button>
              </div>
            </>
          )}

          {!user && (
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 15px -3px rgba(234, 179, 8, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-white font-bold px-8 py-2.5 rounded-full shadow-lg transition-all"
              >
                Login
              </motion.button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center gap-4 z-50">
          {user && (
            <span className="text-gray-800 font-medium text-sm">
              Hi, <span className="text-yellow-500">{user.name}</span>
            </span>
          )}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-900 p-2 bg-gray-100 rounded-full hover:bg-yellow-100 hover:text-yellow-600 transition-colors"
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Glassmorphism Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-2xl shadow-2xl border-t border-gray-100 md:hidden"
          >
            <ul className="flex flex-col items-center py-8 space-y-6 font-semibold text-gray-800 text-lg">
              {navLinks.map((link) => (
                <motion.li key={link.path} whileHover={{ scale: 1.1 }}>
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={isActive(link.path) ? "text-yellow-500" : "hover:text-yellow-500 transition-colors"}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}

              {user && (
                <>
                  <div className="w-16 h-[1px] bg-gray-200 my-2"></div>

                  <motion.li whileHover={{ scale: 1.1 }}>
                    <Link to="/cart" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:text-yellow-500">
                      <FaCartShopping /> Cart
                      {cartItems?.length > 0 && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">{cartItems.length}</span>
                      )}
                    </Link>
                  </motion.li>

                  <motion.li whileHover={{ scale: 1.1 }}>
                    <Link to="/wishlist" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:text-red-500">
                      <IoMdHeart /> Favourites
                      {wishlist?.length > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>
                      )}
                    </Link>
                  </motion.li>

                  <motion.li whileHover={{ scale: 1.1 }}>
                    <Link to="/myorders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:text-yellow-500">
                      <FaBasketShopping /> My Orders
                    </Link>
                  </motion.li>

                  <motion.li whileHover={{ scale: 1.05 }} className="pt-4">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="text-red-500 border border-red-500 px-8 py-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </motion.li>
                </>
              )}

              {!user && (
                <motion.li whileHover={{ scale: 1.05 }} className="pt-4 w-full px-8">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center bg-yellow-500 text-white py-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
                  >
                    Login
                  </Link>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;