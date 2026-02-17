import React, { useContext, useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { 
  FaHome, 
  FaUsers, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaUtensils 
} from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { RiShoppingBag3Fill } from "react-icons/ri";
import { StoreContext } from "../storecontext/Storecontext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin"); // If you use this flag
      setUser(null);
      navigate("/login");
    }
  };

  const navLinks = [
    { path: "dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "menu", name: "Manage Menu", icon: <FaUtensils /> },
    { path: "users", name: "Users", icon: <FaUsers /> },
    { path: "orders", name: "Orders", icon: <RiShoppingBag3Fill /> }, // Added Orders if you have it
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* --- Mobile Header --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex items-center justify-between px-4 z-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-gray-900">
            food<span className="text-yellow-500">ish.</span>
          </span>
          <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-500">Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-gray-700 hover:text-yellow-500 transition-colors focus:outline-none"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* --- Sidebar Overlay (Mobile) --- */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Sidebar Navigation --- */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out z-50
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div>
             <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              food<span className="text-yellow-500">ish.</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium tracking-wider uppercase mt-1">Admin Panel</p>
          </div>
        </div>

        {/* User Profile Snippet */}
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.name || "Administrator"}</p>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 mt-2 overflow-y-auto">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-yellow-500 text-white shadow-md shadow-yellow-200"
                    : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-600"
                }`
              }
            >
              <span className="text-lg">{link.icon}</span>
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-bold text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-colors"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 min-w-0 md:ml-0 transition-all duration-300 pt-16 md:pt-0 bg-gray-50">
        <div className="p-4 md:p-8">
           <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AdminSidebar;