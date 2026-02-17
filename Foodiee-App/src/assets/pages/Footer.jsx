import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaArrowUp } from "react-icons/fa";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 relative">
      {/* Floating Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white p-4 rounded-full shadow-xl hover:bg-yellow-600 transition-all active:scale-90"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              Food<span className="text-yellow-500">ish.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Experience the art of fine dining at your doorstep. Freshly prepared, locally sourced, and delivered with love.
            </p>
            <div className="flex space-x-4">
              {/* Styled Social Containers */}
              {[
                { icon: <FaFacebookF />, color: "hover:bg-blue-600" },
                { icon: <FaInstagram />, color: "hover:bg-pink-600" },
                { icon: <FaTwitter />, color: "hover:bg-sky-500" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className={`w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:ml-auto">
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-gray-200 text-xs">Navigation</h3>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><Link to="/" className="hover:text-yellow-500 transition-colors flex items-center">Home</Link></li>
              <li><Link to="/menu" className="hover:text-yellow-500 transition-colors flex items-center">Explore Menu</Link></li>
              <li><Link to="/about" className="hover:text-yellow-500 transition-colors flex items-center">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-500 transition-colors flex items-center">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="lg:ml-auto">
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-gray-200 text-xs">Help & Support</h3>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li className="hover:text-yellow-500 cursor-pointer transition-colors">Track Order</li>
              <li className="hover:text-yellow-500 cursor-pointer transition-colors">Shipping Info</li>
              <li className="hover:text-yellow-500 cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-yellow-500 cursor-pointer transition-colors">Terms of Use</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-gray-200 text-xs">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-6">Join our list for exclusive discounts and new dish alerts.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 p-3 rounded-xl text-white hover:bg-yellow-600 transition-colors">
                <FaEnvelope size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-gray-500 text-xs font-medium">
            © {new Date().getFullYear()} <span className="text-gray-300">Foodish Inc.</span> Crafted with passion for foodies.
          </div>
          <div className="flex space-x-8 text-[10px] font-bold uppercase tracking-widest text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Support</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;