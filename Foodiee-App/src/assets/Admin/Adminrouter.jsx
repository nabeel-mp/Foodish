
import React from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { StoreContext } from "../storecontext/StoreContext";

const AdminProtectedRoute = ({ children }) => {
  const { user, token } = useContext(StoreContext);

  if (!user && localStorage.getItem("accessToken")) {
    return <div>Loading Auth...</div>; 
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return children ? children : <Outlet />;
};

export default AdminProtectedRoute;
