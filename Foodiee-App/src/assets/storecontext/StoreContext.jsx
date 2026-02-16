import React, { createContext, useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  // 1. Fetch Menu Data (Public)
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menuItems");
        setMenuItems(res.data);
      } catch (error) {
        console.error("Menu fetch failed");
      }
    };
    fetchMenu();
  }, []);

  // 2. Fetch User Data (Private)
  useEffect(() => {
    if (user?.id) {
      // Reload user data on refresh/login
      const loadUserData = async () => {
        try {
            const [cartRes, wishlistRes, ordersRes] = await Promise.all([
                api.get("/cart"),
                api.get("/wishlist"),
                api.get(user.role === 'admin' ? "/orders" : "/orders/myorders")
            ]);

            // Backend returns cart object with 'items' array
            const backendCart = cartRes.data?.items?.map(item => ({
                ...item.productId, // Spread product details
                quantity: item.quantity, // Add quantity from cart
                cartItemId: item.productId._id // Helper for deletion logic
            })) || [];

            setCartItems(backendCart);
            setWishlist(wishlistRes.data || []);
            setOrders(ordersRes.data || []);

        } catch (error) {
          console.error("Error loading user data:", error);
          // If token expired, logout logic here
        }
      };
      loadUserData();
    } else {
      // Clear data on logout
      setCartItems([]);
      setWishlist([]);
      setOrders([]);
    }
  }, [user]);

  // --- Auth Handlers ---
  const handleLoginSuccess = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
  };

  const loginUser = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      handleLoginSuccess(res.data.user, res.data.accessToken);
      toast.success("Login Successful");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
      return false;
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      handleLoginSuccess(res.data.user, res.data.accessToken);
      toast.success("Registration Successful");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration Failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    toast.success("Logged out");
  };

  // --- Cart Functions ---

  const addToCart = async (product) => {
    if (!user) return toast.error("Please login first");

    try {
      // Optimistic Update (makes UI feel fast)
      setCartItems(prev => {
        const exist = prev.find(item => item._id === product._id);
        if (exist) {
          return prev.map(item => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      // API Call
      await api.post("/cart", { productId: product._id, quantity: 1 });
      toast.success("Added to Cart");
    } catch (error) {
      toast.error("Failed to add to cart");
      // Revert state if needed (advanced)
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setCartItems(prev => prev.filter(item => item._id !== productId));
      await api.delete(`/cart/${productId}`);
      toast.success("Removed from Cart");
    } catch (error) {
      console.error(error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    
    try {
      setCartItems(prev => prev.map(item => item._id === productId ? { ...item, quantity } : item));
      await api.put(`/cart/${productId}`, { quantity });
    } catch (error) {
      console.error(error);
    }
  };

  const clearCart = () => setCartItems([]);

  // --- Wishlist Functions ---

  const addToWishlist = async (product) => {
    if (!user) return toast.error("Please login first");
    if (wishlist.some(item => item._id === product._id)) return;

    try {
      setWishlist(prev => [...prev, product]);
      await api.post("/wishlist", { productId: product._id });
      toast.success("Added to Wishlist");
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      setWishlist(prev => prev.filter(item => item._id !== productId));
      await api.delete(`/wishlist/${productId}`);
      toast.success("Removed from Wishlist");
    } catch (error) {
      console.error(error);
    }
  };

  // --- Order Function ---
  const placeOrder = async (orderData) => {
    try {
      const res = await api.post("/orders", orderData);
      setOrders(prev => [res.data, ...prev]);
      // Clear cart locally and optionally call API to empty cart if you have that endpoint
      clearCart(); 
      // Note: You might want to implement a DELETE /api/cart endpoint to empty server cart
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Order Failed");
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        loginUser,
        registerUser,
        logout,
        menuItems,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        orders,
        placeOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;