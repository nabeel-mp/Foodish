import React, {useContext} from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../storecontext/Storecontext";

const ProtectedRoute =({children})=>{
    const {user} =useContext(StoreContext)
    
    if(!user){
        return <Navigate to='/login' replace />
    }

    if(user.role === "admin"){
        return <Navigate to='/admin' replace/>
    }
    return children;
}
export default ProtectedRoute
