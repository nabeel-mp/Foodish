

import React, { useContext } from "react";
import { Routes, Route, useLocation, Navigate} from "react-router-dom";

import Navbar from "./assets/Layout/Navbar";
import Home from "./assets/Hero/Home";
import Menu from "./assets/pages/Menu";
import ProductDetails from "./assets/pages/ProductDetails";
import Cart from "./assets/pages/Cart";
import ThankYou from "./assets/pages/ThankYou";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/register";
import About from "./assets/About/About";
import Contact from "./assets/Contact/Contact";
import Footer from "./assets/pages/Footer";
import Wishlist from "./assets/pages/Wishlist";
import Order from "./assets/pages/Order";
import ProtectedRoute from "./assets/pages/ProtectRoute";
import Myorder from "./assets/pages/MyOrder";
import Dashboard from "./assets/Admin/Dashboard";
import UsersManagement from "./assets/Admin/usermanagment";
import MenuManagement from "./assets/Admin/menumanagment";
import AdminProtectedRoute from "./assets/Admin/Adminrouter";
import AdminSidebar from "./assets/Admin/Adminsidebar";
import Users from "./assets/Admin/users";
import { StoreContext } from "./assets/storecontext/Storecontext";
import ScrollToTop from "./assets/pages/Scrolltotop";
import {Toaster} from "react-hot-toast"




const App = () => {
  const location =useLocation()
  const {user} =useContext(StoreContext)

  const isAdmin =user?.role === 'admin'
  
  const hidenav =location.pathname ==='/login' || location.pathname ==='/register' || location.pathname.startsWith('/admin')

  return (
    <>
    <ScrollToTop/>
      {!hidenav &&  <Navbar/>}
    <Routes>
    <Route path="/admin" element={<AdminProtectedRoute><AdminSidebar/></AdminProtectedRoute>}>
    <Route index element={<Navigate to="dashboard"/>}/>
    <Route path="dashboard" element={<Dashboard/>}/>
    <Route path="menu" element={<MenuManagement/>}/>
    <Route path="user/:userId" element={<UsersManagement/>}/>
    <Route path="users" element={<Users/>}/> </Route>


        <Route path="/" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <Home/>} />
        <Route path="/menu" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <Menu/>} />
        <Route path="/products/:id" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <ProductDetails/>} />

        <Route path="/cart"
         element={
          <ProtectedRoute>
            {isAdmin ? <Navigate to='/admin/dashboard'/> : <Cart/>}
          </ProtectedRoute>
         } />
        <Route path="/login" element={<Login />} />
        <Route path="/thankyou" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <ThankYou/>} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <About/>} />
        <Route path="/contact" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <Contact/>} />
        <Route path="/wishlist" 
        element={
          <ProtectedRoute>
            {isAdmin ? <Navigate to='/admin/dashboard'/> : <Wishlist/>}
          </ProtectedRoute>
        } />
        <Route path="/order" 
        element={
          <ProtectedRoute>
            {isAdmin ? <Navigate to='/admin/dashboard'/> : <Order/>}
          </ProtectedRoute>
        } />
        <Route path="/myorders"
         element={
          <ProtectedRoute>
            {isAdmin ? <Navigate to='/admin/dashboard'/> : <Myorder/>}
          </ProtectedRoute>
         } />
         
        
      </Routes>
         <Toaster position="top-right" reverseOrder={false}/>
        {!hidenav &&  <Footer/>}
    
    </>
  );
};

export default App;

