import React, { useContext } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart, FaHeartBroken, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              My <span className="text-yellow-500">Favourites</span>
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              Items you've saved for later cravings.
            </p>
          </div>
          {wishlist.length > 0 && (
            <button 
              onClick={() => navigate('/menu')}
              className="flex items-center space-x-2 text-yellow-600 font-bold hover:text-yellow-700 transition-colors group"
            >
              <span>Continue Shopping</span>
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={12} />
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {wishlist.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <FaHeartBroken className="text-gray-300 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is lonely</h3>
              <p className="text-gray-500 mb-8 text-center max-w-xs">
                Add your favorite dishes here and order them whenever you're ready!
              </p>
              <button 
                onClick={() => navigate('/menu')}
                className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-yellow-500 shadow-lg transition-all active:scale-95"
              >
                Explore Menu
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {wishlist.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <motion.div
                    key={itemId}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
                  >
                    {/* Image Section */}
                    <div 
                      className="relative h-48 overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/products/${itemId}`)}
                    >
                      <img 
                        src={item.img} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-sm">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-yellow-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xl font-black text-gray-900 mb-6">₹{item.price}</p>
                      
                      <div className="mt-auto flex gap-3">
                        <button
                          onClick={() => addToCart(item)}
                          className="flex-grow flex items-center justify-center space-x-2 bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 transition-all shadow-md shadow-yellow-100 active:scale-95"
                        >
                          <FaShoppingCart size={14} />
                          <span>Add to Cart</span>
                        </button>
                        
                        <button
                          onClick={() => removeFromWishlist(itemId)}
                          className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 border border-gray-100"
                          title="Remove from wishlist"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wishlist;