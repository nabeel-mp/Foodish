
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
