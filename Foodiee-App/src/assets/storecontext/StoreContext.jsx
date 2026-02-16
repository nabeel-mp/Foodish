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

  // --- 1. Load Menu Items (Public) ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menuItems");
        setMenuItems(res.data);
      } catch (error) {
        console.error("Failed to load menu items:", error);
      }
    };
    fetchMenu();
  }, []);

  // --- 2. Load User-Specific Data (Private) ---
  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        try {
          // Fetch User's Orders
          // If Admin, you might want to fetch ALL orders in the Admin Dashboard instead
          const orderEndpoint = user.role === 'admin' ? '/orders' : '/orders/myorders';
          
          // NOTE: Cart and Wishlist endpoints depend on if you implemented 
          // cartController/wishlistController in backend. 
          // If not, we manage them locally below or use placeholders.
          
          const [ordersRes] = await Promise.all([
            api.get(orderEndpoint),
            // api.get("/cart"),      // Uncomment if backend has cart routes
            // api.get("/wishlist")   // Uncomment if backend has wishlist routes
          ]);

          setOrders(ordersRes.data);
          
          // If backend doesn't store cart/wishlist, we can load from localStorage (Optional)
          // const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
          // setCartItems(savedCart);

        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    } else {
      // Clear sensitive data on logout
      setCartItems([]);
      setWishlist([]);
      setOrders([]);
    }
  }, [user]);

  // --- 3. Auth Actions ---

  const registerUser = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      
      // The backend returns: { user, accessToken }
      const { user: newUser, accessToken } = res.data;
      
      handleLoginSuccess(newUser, accessToken);
      toast.success("Registration Successful!");
      return true;
    } catch (err) {
      console.error("Register error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Registration Failed");
      return false;
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      
      const { user: loggedUser, accessToken } = res.data;
      
      handleLoginSuccess(loggedUser, accessToken);
      toast.success("Login Successful!");
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data?.message);
      toast.error(err.response?.data?.message || "Login Failed");
      return false;
    }
  };

  const handleLoginSuccess = (userData, accessToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    // Add refresh token logic here if your backend sends one
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
    setWishlist([]);
    setOrders([]);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("Logged out successfully");
  };

  // --- 4. Cart Logic (Hybrid: State + Optional API) ---
  
  const addToCart = async (item) => {
    if (!user) {
        toast.error("Please login to add items");
        return;
    }

    // Optimistic UI Update (Update State Immediately)
    const existing = cartItems.find((x) => x.id === item.id);
    let newCart;
    
    if (existing) {
        if (existing.quantity >= 5) {
            toast.error("Max quantity reached");
            return;
        }
        newCart = cartItems.map((x) => x.id === item.id ? { ...x, quantity: x.quantity + 1 } : x);
    } else {
        newCart = [...cartItems, { ...item, quantity: 1 }];
    }
    
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart)); // Sync local

    // Sync with Backend (Fire and Forget)
    try {
      // Uncomment if backend Cart API exists
      // await api.post("/cart", { productId: item.id, quantity: 1 }); 
    } catch (error) {
      console.error("Sync cart failed");
    }
    toast.success("Added to cart");
  };

  const removeFromCart = async (id) => {
    const newCart = cartItems.filter((item) => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));

    try {
      // await api.delete(`/cart/${id}`);
    } catch (error) {
      console.error("Remove cart item failed");
    }
  };

  const updateQuantity = async (id, quantity) => {
    const newCart = cartItems.map((item) => (item.id === id ? { ...item, quantity } : item));
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // --- 5. Wishlist Logic ---
  const addToWishlist = (item) => {
    if (!user) return toast.error("Please login first");
    if (wishlist.some((i) => i.id === item.id)) return;

    const newWishlist = [...wishlist, item];
    setWishlist(newWishlist);
    // await api.post("/wishlist", { productId: item.id });
    toast.success("Added to Favorites");
  };

  const removeFromWishlist = (id) => {
    const newWishlist = wishlist.filter((item) => item.id !== id);
    setWishlist(newWishlist);
    // await api.delete(`/wishlist/${id}`);
    toast.success("Removed from Favorites");
  };

  // --- 6. Order Logic ---
  const placeOrder = async (orderData) => {
    try {
      // Send order to backend
      const res = await api.post("/orders", orderData);
      
      // Update local orders state
      setOrders((prev) => [res.data, ...prev]);
      
      clearCart();
      return true;
    } catch (err) {
      console.error("Failed to place order:", err);
      toast.error(err.response?.data?.message || "Order Failed");
      return false;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        cartItems,
        setCartItems,
        wishlist,
        orders,
        menuItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        placeOrder,
        logout,
        loginUser,
        registerUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;