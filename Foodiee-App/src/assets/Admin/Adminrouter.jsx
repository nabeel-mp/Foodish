// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { StoreContext } from "../storecontext/storecontext";

// const AdminProtectedRoute = ({ children }) => {
//   const { user } = useContext(StoreContext);
//   const isAdmin = user?.role === "admin";
//   return isAdmin ? children : <Navigate to="/" replace />;
// };

// export default AdminProtectedRoute;

// Adminrouter.jsx
import React from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { StoreContext } from "../storecontext/Storecontext";

const AdminProtectedRoute = ({ children }) => {
  const { user } = useContext(StoreContext);

  if (!user || user.role !== "admin") return <Navigate to="/login" />;
  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;
