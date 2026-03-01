import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FaUser, 
  FaTrash, 
  FaBan, 
  FaCircleCheck, 
  FaMagnifyingGlass, 
  FaEye,
  FaEnvelope,
  FaShieldHalved
} from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import { showConfirmToast } from "../../utils/confirmToast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        if (res.data.success) {
          setUsers(res.data.data);
          setFilteredUsers(res.data.data);
        } else {
          setUsers([]);
          setFilteredUsers([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const result = users.filter((user) => 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  const handleDelete = useCallback(async (id) => {
    const confirmed = await showConfirmToast({
      title: "Delete this user account?",
      description: "This will permanently remove the user.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((user) => (user.id || user._id) !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  }, []);

  const toggleBlockStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    
    setUsers((prev) => prev.map((u) => (u.id || u._id) === id ? { ...u, status: newStatus } : u));
    setFilteredUsers((prev) => prev.map((u) => (u.id || u._id) === id ? { ...u, status: newStatus } : u));

    try {
      await api.patch(`/admin/users/${id}/block`);
    } catch (err) {
      alert("Status update failed. Reverting...");
      setUsers((prev) => prev.map((u) => (u.id || u._id) === id ? { ...u, status: currentStatus } : u));
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Directory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              User <span className="text-orange-500">Directory</span>
            </h2>
            <p className="text-slate-500 font-medium italic text-sm md:text-base">Monitor and manage access for your customer base.</p>
          </div>

          <div className="relative group w-full lg:w-96">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
            />
          </div>
        </header>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 mb-8 rounded-2xl font-bold text-sm text-center">
            {error}
          </div>
        )}

        {/* --- Card Grid (Responsive) --- */}
        <div className="min-h-[400px]">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                <FaUser size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-900">No customers found</h3>
              <p className="text-slate-400 text-sm italic">Adjust your search or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user) => {
                  const userId = user.id || user._id;
                  const isActive = user.status === "active";

                  return (
                    <motion.div 
                      key={userId}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-[2rem] border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative"
                    >
                      {/* Role Badge */}
                      <span className="absolute top-5 left-5 px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                        {user.role || "User"}
                      </span>

                      {/* Avatar & Name */}
                      <div className="mt-6 mb-6 text-center">
                        <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-black text-3xl mx-auto shadow-lg shadow-orange-100 ring-4 ring-white mb-4">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="font-black text-slate-900 truncate px-2">{user.name}</h3>
                        <div className="flex items-center justify-center gap-2 text-slate-400 mt-1">
                           <FaEnvelope size={10} className="text-orange-400" />
                           <p className="text-xs truncate font-medium max-w-[150px]">{user.email}</p>
                        </div>
                      </div>

                      {/* Status Row */}
                      <div className="flex items-center justify-center mb-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          isActive 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                            : "bg-rose-50 text-rose-600 border-rose-100"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {user.status || "Unknown"}
                        </span>
                      </div>

                      {/* Actions Row */}
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-50">
                        <Link 
                          to={`/admin/users/${userId}`}
                          className="flex-1 flex justify-center items-center py-2.5 bg-slate-900 text-white rounded-xl hover:bg-orange-600 transition-all group/btn"
                        >
                          <FaEye size={14} className="group-hover/btn:scale-110 transition-transform" />
                        </Link>
                        
                        <button
                          onClick={() => toggleBlockStatus(userId, user.status)}
                          className={`flex-1 flex justify-center items-center py-2.5 rounded-xl transition-all border ${
                            isActive 
                              ? "bg-white border-orange-200 text-orange-500 hover:bg-orange-50" 
                              : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                          }`}
                        >
                          {isActive ? <FaBan size={14} /> : <FaCircleCheck size={14} />}
                        </button>

                        <button
                          onClick={() => handleDelete(userId)}
                          className="flex-1 flex justify-center items-center py-2.5 bg-white border border-rose-100 text-rose-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        <footer className="mt-12 text-center">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Directory End • {filteredUsers.length} Customers Loaded
            </span>
        </footer>
      </div>
    </div>
  );
};

export default Users;
