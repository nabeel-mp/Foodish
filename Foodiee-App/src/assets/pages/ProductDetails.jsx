import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../storecontext/StoreContext";
import { motion } from "framer-motion";
import { FaChevronLeft, FaStar, FaShoppingBasket, FaBolt } from "react-icons/fa";
import api from "../../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cartItems } = useContext(StoreContext);

  const singleProduct = location.state?.singleProduct;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Priority 1: State from navigation
        if (singleProduct && (singleProduct._id === id || singleProduct.id === id)) {
          setProduct(singleProduct);
          setLoading(false);
        }
        // Priority 2: Fresh API call
        const res = await api.get(`/menuItems/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, singleProduct]);

  const handleAddToCart = () => {
    // Pass quantity if your context supports it, else default
    addToCart({ ...product, quantity });
    navigate("/cart");
  };

  const isInCart = product && cartItems.some((item) => (item._id || item.id) === (product._id || product.id));

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mb-4"></div>
        <p className="text-gray-500 font-medium">Preparing details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 pt-24">
        <h2 className="text-2xl font-bold text-gray-800">Dish not found</h2>
        <button onClick={() => navigate("/menu")} className="mt-4 text-yellow-600 font-bold hover:underline">
          Back to Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
        >
          <FaChevronLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to browsing
        </button>

        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 overflow-hidden flex flex-col md:flex-row border border-gray-100">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/2 h-[400px] md:h-auto relative"
          >
            <img
              src={product.img}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
              <span className="text-yellow-600 font-bold text-sm uppercase tracking-widest">{product.category}</span>
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <FaStar key={i} size={14} />)}
              </div>
              <span className="text-gray-400 text-sm">(4.8 / 5 reviews)</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
              {product.title}
            </h1>
            
            <p className="text-3xl font-extrabold text-yellow-500 mb-6">
              ₹{product.price}
            </p>

            <p className="text-gray-500 leading-relaxed mb-8 text-lg">
              {product.desc || product.description || "Indulge in our chef's special preparation using fresh, locally sourced ingredients. Perfect for satisfying your cravings with authentic flavors."}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-6 mb-8">
              <span className="font-bold text-gray-700">Quantity</span>
              <div className="flex items-center border-2 border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
                >—</button>
                <span className="px-4 py-2 font-bold text-gray-900 w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors"
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center space-x-2 py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg ${
                  isInCart 
                  ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                  : "bg-gray-900 text-white hover:bg-yellow-500 hover:shadow-yellow-200"
                }`}
              >
                <FaShoppingBasket />
                <span>{isInCart ? "Go to Cart" : "Add to Cart"}</span>
              </button>

              <button
                onClick={() => navigate("/order", { state: { singleProduct: { ...product, quantity } } })}
                className="flex items-center justify-center space-x-2 bg-yellow-500 text-white py-4 rounded-2xl font-bold hover:bg-yellow-600 transition-all transform active:scale-95 shadow-lg shadow-yellow-100"
              >
                <FaBolt />
                <span>Order Now</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;