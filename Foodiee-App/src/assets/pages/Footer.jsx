import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 pt-6 sticky">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
    
        <div>
          <h2 className="text-xl font-bold text-yellow-400">Foodish.</h2>
          <p className="text-sm mt-2">
            Delivering happiness to your doorstep. Fresh meals. Fast service.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
            <li><Link to="/menu" className="hover:text-yellow-400">Menu</Link></li>
            <li><Link to="/about" className="hover:text-yellow-400">About</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-400">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mt-2">
            <a href="#" className="hover:text-blue-400"><FaFacebook size={20} /></a>
            <a href="#" className="hover:text-pink-400 "><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-blue-400"><FaTwitter size={20} /></a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm mt-6 text-gray-400">
        © {new Date().getFullYear()} Foodish. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
