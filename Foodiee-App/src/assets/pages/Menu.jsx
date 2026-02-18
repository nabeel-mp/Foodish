import React, { useContext, useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../storecontext/StoreContext";
import { FaHeart, FaRegHeart, FaSearch } from "react-icons/fa";
import { BiSortAlt2, BiFilterAlt } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { user, wishlist, removeFromWishlist, addToWishlist } = useContext(StoreContext);

  // --- 1. Fetch Data ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const res = await api.get("/menuItems");
        // Remove duplicates based on title
        const uniqueItems = res.data.filter(
          (item, index, self) =>
            index === self.findIndex((i) => i.title === item.title)
        );
        setMenuItems(uniqueItems);
      } catch (err) {
        console.error("Error fetching menu Items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // --- 2. Filter & Sort Logic (Memoized for Performance) ---
  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    if (search) {
      result = result.filter((item) =>
        item.title?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      result = result.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (sort === "low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort, menuItems]);

  const categories = ["All", "Biriyani", "Burger", "Pizza", "Dessert", "Drinks", "Mandhi", "Snacks", "Others"];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      
      {/* --- Header Section --- */}
      <div className="text-center mb-10 px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900"
        >
          Our <span className="text-yellow-500">Delicious</span> Menu
        </motion.h2>
        <p className="text-gray-500 mt-3 text-lg">
          Choose from a wide range of mouth-watering dishes.
        </p>
      </div>

      {/* --- Sticky Filter Bar --- */}
      <div className="sticky top-16 z-40 bg-white/90 backdrop-blur-md shadow-sm border-y border-gray-100 py-4 px-4 mb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search */}
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search food..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-yellow-400 outline-none transition-all"
            />
          </div>

          {/* Categories */}
          <div className="w-full md:w-auto flex overflow-x-auto no-scrollbar gap-2 py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  category === cat
                    ? "bg-yellow-500 text-white shadow-md scale-105"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Menu Grid --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            <p className="text-gray-500 animate-pulse">Loading flavors...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-bold text-gray-700">No items found</h3>
            <p className="text-gray-500">Try changing your filters or search term.</p>
            <button 
              onClick={() => {setSearch(""); setCategory("All"); setSort("");}}
              className="mt-4 text-yellow-600 hover:text-yellow-700 font-bold"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence>
              {filteredItems.map((item) => {
                const itemId = item._id || item.id;
                const isWishlisted = wishlist.some((i) => (i._id || i.id) === itemId);
                const isAvailable = item.available !== false; // Handle undefined as true

                return (
                  <motion.div
                    key={itemId}
                    layout
                    variants={cardVariants}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full relative ${isAvailable ? 'hover:shadow-xl' : 'opacity-80'}`}
                  >
                    {/* Image Section */}
                    <div 
                      className={`relative h-52 w-full overflow-hidden ${isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => isAvailable && navigate(`/products/${itemId}`)}
                    >
                      <img
                        src={item.img}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${isAvailable ? 'group-hover:scale-110' : 'grayscale'}`}
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                          {item.category}
                        </span>
                      </div>
                      
                      {/* SOLD OUT OVERLAY */}
                      {!isAvailable && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <span className="text-white border-2 border-white px-4 py-2 font-bold tracking-wider text-xl rotate-[-15deg]">
                                SOLD OUT
                            </span>
                        </div>
                      )}
                    </div>

                    {/* Wishlist Button */}
                    {user && (
                      <button
                        onClick={() => isWishlisted ? removeFromWishlist(itemId) : addToWishlist(item)}
                        className="absolute top-3 right-3 p-2.5 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors z-20"
                      >
                        {isWishlisted ? (
                          <FaHeart className="text-red-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-lg" />
                        )}
                      </button>
                    )}

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{item.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
                        {item.description || `Freshly prepared ${item.title} made with premium ingredients.`}
                      </p>

                      <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 font-medium uppercase">Price</p>
                          <p className="text-xl font-black text-gray-900">₹{item.price}</p>
                        </div>
                        <button 
                          onClick={() => navigate(`/products/${itemId}`)}
                          disabled={!isAvailable}
                          className={`px-5 py-2 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                            isAvailable 
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                            : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                          }`}
                        >
                          {isAvailable ? "View" : "Sold Out"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Menu;