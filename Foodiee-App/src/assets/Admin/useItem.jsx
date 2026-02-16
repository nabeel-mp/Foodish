import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserItem = ({ user, onDelete, onToggleBlock }) => {
  const navigate = useNavigate();

  const handleBlockToggle = () => {
    const action = user.status === "active" ? "Blocked" : "Unblocked";
    toast.promise(onToggleBlock(user.id, user.status), {
      loading: "Updating...",
      success: `User ${action} successfully!`,
      error: "Failed to update status.",
    });
  };

  const handleDelete = () => {
    toast.promise(onDelete(user.id), {
      loading: "Deleting user...",
      success: "User deleted successfully!",
      error: "Failed to delete user.",
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4 transition hover:scale-[1.01]">
      {/* User Info */}
      <div className="text-center sm:text-left">
        <p className="text-lg font-medium">{user.name}</p>
        <p className="text-sm text-gray-400">{user.email}</p>
        <p
          className={`text-sm font-semibold mt-1 ${
            user.status === "active" ? "text-green-400" : "text-red-400"
          }`}
        >
          {user.status}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate(`/admin/user/${user.id}`)}
          className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium"
        >
          View
        </button>

        <button
          type="button"
          onClick={handleBlockToggle}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            user.status === "active"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {user.status === "active" ? "Block" : "Unblock"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserItem;
