import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import UserItem from "./useItem";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3002/userDetails");
        setUsers(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = useCallback(async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return Promise.reject();

    return axios.delete(`http://localhost:3002/userDetails/${id}`).then(() => {
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    });
  }, []);

  const toggleBlockStatus = useCallback(async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "blocked" : "active";

    return axios.patch(`http://localhost:3002/userDetails/${id}`, { status: newStatus }).then(() => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, status: newStatus } : user
        )
      );
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white">
      <h2 className="text-3xl font-semibold text-yellow-400 mb-6 text-center">
        Users Management
      </h2>

      {error && <p className="text-center text-red-500 text-lg">{error}</p>}

      {!error && (
        <div className="grid gap-6">
          {users.length === 0 ? (
            <p className="text-center text-gray-400">No users found.</p>
          ) : (
            users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onDelete={handleDelete}
                onToggleBlock={toggleBlockStatus}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Users;
