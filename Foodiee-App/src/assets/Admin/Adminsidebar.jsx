import React, { useContext, useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { FaHome, FaUsers, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { StoreContext } from "../storecontext/Storecontext";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(StoreContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Top Bar (mobile only) */}
      <div className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between bg-gray-900 text-white px-4 py-4 z-50 shadow">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl text-white"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="text-lg font-bold">Admin Panel</h1>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-40
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Header (desktop only) */}
        <div className="hidden md:flex items-center justify-between px-6 py-5 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="mt-1 text-sm text-gray-300">{user?.name || "Admin"}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 mt-12 md:mt-0">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-black"
                  : "text-amber-300 hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaHome /> Dashboard
          </NavLink>

          <NavLink
            to="menu"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-black"
                  : "text-amber-300 hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <IoFastFoodSharp /> Dishes
          </NavLink>

          <NavLink
            to="users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-amber-500 text-black"
                  : "text-amber-300 hover:bg-gray-800"
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FaUsers /> Users
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 mt-auto bg-red-600 hover:bg-red-700 text-white transition-colors w-full text-left"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Overlay (mobile only) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 overflow-y-auto transition-all pt-14 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminSidebar;
