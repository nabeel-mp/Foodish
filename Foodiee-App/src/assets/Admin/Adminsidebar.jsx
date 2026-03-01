import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHouse, 
  FaUtensils, 
  FaUsers, 
  FaBasketShopping, 
  FaTruck, 
  FaWallet, 
  FaArrowRightFromBracket 
} from "react-icons/fa6";
import { RiAccountPinCircleFill } from "react-icons/ri";
import Logo from "./foodiee.jpeg";
import { StoreContext } from "../storecontext/StoreContext";
import { showConfirmToast } from "../../utils/confirmToast";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(StoreContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    const confirmed = await showConfirmToast({
      title: "Logout from Admin Panel?",
      description: "Your current admin session will end.",
      confirmText: "Logout",
      cancelText: "Stay",
      variant: "warning",
    });

    if (!confirmed) return;

    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname.includes(path);

  const navLinks = [
    { path: "dashboard", name: "Home", icon: <FaHouse size={20} /> },
    { path: "menu", name: "Menu", icon: <FaUtensils size={20} /> },
    { path: "orders", name: "Orders", icon: <FaBasketShopping size={20} /> },
    { path: "users", name: "Users", icon: <FaUsers size={20} /> },
    { path: "delivery-boys", name: "Delivery", icon: <FaTruck size={20} /> },
    { path: "accounts", name: "Finance", icon: <FaWallet size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* --- TOP FIXED HEADER (Mobile & Desktop) --- */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-white shadow-md py-3" : "bg-white/80 backdrop-blur-md py-4"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Logo" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-gray-900 tracking-tighter">
                food<span className="text-yellow-500">ish.</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Admin Studio</span>
            </div>
          </div>

          {/* Desktop Nav (Hidden on Mobile) */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-bold transition-all px-2 py-1 relative ${
                    isActive ? "text-yellow-500" : "text-slate-500 hover:text-yellow-500"
                  }`
                }
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div layoutId="adminUnderline" className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-500 rounded-full" />
                )}
              </NavLink>
            ))}
          </nav>

          {/* Admin Profile & Logout */}
          <div className="flex items-center gap-3 border-l pl-4 border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-900 leading-none">{user?.name || "Root Admin"}</p>
              <p className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Master Access</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <FaArrowRightFromBracket size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE BOTTOM NAVIGATION (YouTube Style) --- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 pb-safe">
        <div className="flex justify-around items-center h-16">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isActive ? "text-yellow-500" : "text-slate-400"
                }`
              }
            >
              <div className="relative">
                {link.icon}
                {isActive(link.path) && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-yellow-500 rounded-full"
                  />
                )}
              </div>
              <span className="text-[10px] mt-1 font-black uppercase tracking-tighter">{link.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 w-full pt-24 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Outlet />
        </div>
      </main>

      {/* Spacer for Mobile to prevent content overlap */}
      <div className="md:hidden h-16"></div>

    </div>
  );
};

export default AdminSidebar;
