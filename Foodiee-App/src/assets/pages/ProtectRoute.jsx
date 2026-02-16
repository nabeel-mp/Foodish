import React, {useContext} from "react";
import { Navigate, useLocation } from "react-router-dom";
import { StoreContext } from "../storecontext/Storecontext";

const ProtectedRoute =({ children, role })=>{
    const {user} =useContext(StoreContext)
    const location = useLocation();
    
    if(!user){
        return <Navigate to='/login' state={{ from: location }} replace />
    }

    if(user.role === "admin"){
        return <Navigate to='/admin' replace/>
    }

    if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

    return children;
}
export default ProtectedRoute
