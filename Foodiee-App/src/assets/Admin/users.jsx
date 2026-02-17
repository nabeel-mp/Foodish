import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaTrash, 
  FaBan, 
  FaCheckCircle, 
  FaSearch, 
  FaEye 
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Fetch Users ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/userDetails");
        setUsers(res.data);
        setFilteredUsers(res.data);
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

  // --- Search Logic ---
  useEffect(() => {
    const result = users.filter((user) => 
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(result);
  }, [search, users]);

  // --- Delete User ---
  const handleDelete = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
      await api.delete(`/userDetails/${id}`);
      setUsers((prev) => prev.filter((user) => (user.id || user._id) !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  }, []);

  // --- Toggle Block Status ---
  const toggleBlockStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";
    // Optimistic update
    const updatedUsers = users.map((user) => 
      (user.id || user._id) === id ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);

    try {
      await api.patch(`/userDetails/${id}`, { status: newStatus });
    } catch (err) {
      // Revert if failed
      alert("Failed to update status");
      setUsers(users); 
    }
  }, [users]);

  // --- Render Loading ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              User <span className="text-yellow-500">Management</span>
            </h2>
            <p className="text-gray-500 mt-1">Manage user access and view details.</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* --- Error State --- */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm">
            <p>{error}</p>
          </div>
        )}

        {/* --- Table Section --- */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                <FaUser />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No users found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-5 font-semibold">User</th>
                    <th className="p-5 font-semibold">Role</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredUsers.map((user) => {
                      const userId = user.id || user._id;
                      const isActive = user.status === "active";

                      return (
                        <motion.tr 
                          key={userId}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-yellow-50/30 transition-colors group"
                        >
                          {/* User Info */}
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="p-5">
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200 uppercase">
                              {user.role || "User"}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-5">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              isActive 
                                ? "bg-green-50 text-green-600 border-green-200" 
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              {user.status || "Unknown"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              
                              {/* View Details */}
                              <Link 
                                to={`/admin/users/${userId}`}
                                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                title="View Details"
                              >
                                <FaEye />
                              </Link>

                              {/* Block/Unblock */}
                              <button
                                onClick={() => toggleBlockStatus(userId, user.status)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isActive 
                                    ? "bg-orange-50 text-orange-500 hover:bg-orange-100" 
                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                }`}
                                title={isActive ? "Block User" : "Unblock User"}
                              >
                                {isActive ? <FaBan /> : <FaCheckCircle />}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDelete(userId)}
                                className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                title="Delete User"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Footer Note */}
        <div className="mt-4 text-center text-gray-400 text-sm">
           Showing {filteredUsers.length} users
        </div>

      </div>
    </div>
  );
};

export default Users;