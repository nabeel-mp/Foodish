
import React, { useContext, useEffect } from "react";
import { StoreContext } from "../storecontext/StoreContext";
import { useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";

const Cart = () => {
    const { user, cartItems, addToCart, updateQuantity, removeFromCart } =
        useContext(StoreContext);

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) return null;

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    const handleDecrement = (item) => {
        if (item.quantity > 1) {
            updateQuantity(item.id, item.quantity - 1);
        }

    };

    const handleCheckout = () => {
        navigate('/order')
    };

    return (
        <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">

            {cartItems.length === 0 ? (
                <div className="bg-transparent relative top-40">
                    <FaCartShopping size={80} className="text-center text-yellow-500 ml-142" />
                    <br />
                    <p className="text-center text-yellow-400 font-semibold text-3xl items-center">Your cart is empty.</p>
                    <p className="text-center text-gray-400 font-mono text-xl items-center">Please Add To Cart</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2 text-center text-yellow-400 mt-15">
                        Your Cart
                    </h1>
                    <p className="text-center mb-4 font-medium">Check your selected items, update quantities, and proceed to checkout when you're ready to eat!</p>
                    {cartItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between items-center bg-gray-700 p-4 rounded shadow"
                        >
                            <img
                                src={item.img}
                                alt={item.title}
                                className="w-20 h-20 rounded object-cover"
                            />

                            <div className="flex-1 px-6">
                                <h3 className="text-xl font-semibold">{item.title}</h3>
                                <p className="text-yellow-400 font-semibold">₹{item.price}</p>

                                <div className="flex items-center mt-3 gap-3">
                                    <button
                                        onClick={() => handleDecrement(item)}
                                        disabled={item.quantity === 1}
                                        className={`px-3 py-1 rounded transition 
                                         ${item.quantity === 1
                                                ? "bg-red-400 opacity-50 cursor-not-allowed"
                                                : "bg-red-600 hover:bg-red-700"}`}
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={item.quantity === 5}
                                        className={`px-3 py-1 rounded transition
                                            ${item.quantity === 5
                                                ? "bg-green-400 opacity-50 cursor-not-allowed"
                                                : "bg-green-600 hover:bg-green-700"
                                            }`}
                                    >
                                        +
                                    </button>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="ml-6 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded"
                                        title="Remove item"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            <div className="text-right text-yellow-400 font-bold text-lg">
                                ₹{item.price * item.quantity}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-between items-center mt-10 border-t border-yellow-400 pt-6">
                        <h2 className="text-2xl font-bold">Total:</h2>
                        <p className="text-2xl font-bold text-yellow-400">₹{totalPrice}</p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="mt-8  bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded mx-auto block"
                    >
                        Proceed to Checkout
                    </button>
                    <button
                        onClick={() => navigate('/menu')}
                        className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-3 px-8 rounded mx-auto block"
                    >
                        Continue shopping
                    </button>
                </div>
            )}

        </div>
    );
};

export default Cart;
