import React, { useContext } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, addToCart } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-6 text-white">
      <h2 className="text-3xl font-bold text-center text-yellow-400 mb-8">My Wishlist</h2>
      
      {wishlist.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-gray-400 text-lg mb-4">Your wishlist is empty.</p>
          <button 
            onClick={() => navigate('/menu')}
            className="bg-yellow-400 text-black px-6 py-2 rounded font-bold"
          >
            Go to Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {wishlist.map((item) => (
            <div key={item._id} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:transform hover:scale-105 transition duration-300">
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{item.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400 font-bold text-lg">₹{item.price}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeFromWishlist(item._id)}
                      className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition"
                      title="Remove"
                    >
                      <FaTrash size={14} />
                    </button>
                    <button
                      onClick={() => addToCart(item)}
                      className="p-2 bg-green-500/20 text-green-500 rounded-full hover:bg-green-500 hover:text-white transition"
                      title="Add to Cart"
                    >
                      <FaShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;