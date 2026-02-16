import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const ThankYou = () => {


  return (
    <div className="h-[70vh] flex flex-col justify-center items-center bg-green-50 text-center px-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Thank You! </h1>
      <p className="text-lg text-gray-700">Your order has been placed successfully.</p>
      <p className="text-md text-gray-600 mt-2">We'll start preparing it right away.</p>

      <Link to="/menu">
        <button className="mt-6 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-6 rounded">
          Continue Ordering
        </button>
      </Link>

    </div>
  );
};

export default ThankYou;

