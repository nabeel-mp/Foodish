import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../storecontext/StoreContext";
import api from "../../api/axios";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, cartItems } = useContext(StoreContext);

  const singleProduct = location.state?.singleProduct;

  useEffect(() => {
    if (singleProduct && (singleProduct._id === id || singleProduct.id === id)) {
      setProduct(singleProduct);
      setLoading(false); // Optional: You can still fetch fresh data in background
    }
    setLoading(true);
    api
      .get(`/menuItems/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    navigate("/cart");
  };

 const isInCart = product && cartItems.some((item) => {
    const itemId = item._id || item.id;
    const productId = product._id || product.id;
    return itemId === productId;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-yellow-400 text-xl font-semibold pt-24">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl font-semibold pt-24">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-24 px-6">
      <div className="bg-gray-700 rounded-lg shadow-lg max-w-5xl mx-auto flex flex-col md:flex-row overflow-hidden">
        {/* Product Image */}
        <img
          src={product.img}
          alt={product.title || "Product"}
          className="w-full md:w-1/2 h-64 md:h-auto object-cover"
        />

        {/* Product Details */}
        <div className="p-6 flex flex-col justify-between md:w-1/2">
          <div>
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              {product.title}
            </h2>
            <p className="text-yellow-300 text-2xl font-semibold mb-4">
              ₹{product.price}
            </p>
            <p className="text-gray-300 mb-6">
              {product.desc || "No description available."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {isInCart ? (
              <button
                onClick={() => navigate("/cart")}
                className="bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-yellow-300 transition"
              >
                Go to Cart
              </button>
            ) : (
              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-yellow-300 transition"
              >
                Add to Cart
              </button>
            )}

            <button
              onClick={() =>
                navigate("/order", { state: { singleProduct: product } })
              }
              className="bg-yellow-400 text-black py-3 rounded font-semibold hover:bg-yellow-300 transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
