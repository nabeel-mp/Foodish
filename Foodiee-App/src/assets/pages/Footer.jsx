import React from "react";
import { Link } from "react-router-dom";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaEnvelope, 
  FaArrowUp,
  FaChevronRight 
} from "react-icons/fa6";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background element for Studio feel */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

      {/* Floating Scroll to Top Button */}
      <button 
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white p-4 rounded-full shadow-2xl hover:bg-yellow-600 transition-all active:scale-90 z-10"
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Section - Centered on Mobile */}
          <div className="space-y-6 text-center sm:text-left flex flex-col items-center sm:items-start">
            <h2 className="text-3xl font-black tracking-tighter text-white">
              Food<span className="text-yellow-500">ish.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs italic">
              Experience the art of fine dining at your doorstep. Freshly prepared, locally sourced, and delivered with love.
            </p>
            <div className="flex space-x-3">
              {[
                { icon: <FaFacebookF />, color: "hover:bg-blue-600" },
                { icon: <FaInstagram />, color: "hover:bg-pink-600" },
                { icon: <FaTwitter />, color: "hover:bg-sky-500" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className={`w-10 h-10 rounded-2xl bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 border border-gray-700/50 ${social.color}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left lg:ml-auto">
            <h3 className="text-[10px] font-black mb-8 uppercase tracking-[0.2em] text-yellow-500">Navigation</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors inline-flex items-center gap-2 group"><FaChevronRight size={8} className="text-yellow-500 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Home</Link></li>
              <li><Link to="/menu" className="hover:text-white transition-colors inline-flex items-center gap-2 group"><FaChevronRight size={8} className="text-yellow-500 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Explore Menu</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors inline-flex items-center gap-2 group"><FaChevronRight size={8} className="text-yellow-500 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors inline-flex items-center gap-2 group"><FaChevronRight size={8} className="text-yellow-500 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" /> Contact Us</Link></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="text-center sm:text-left lg:ml-auto">
            <h3 className="text-[10px] font-black mb-8 uppercase tracking-[0.2em] text-yellow-500">Help & Support</h3>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">Track Order</li>
              <li className="hover:text-white cursor-pointer transition-colors">Shipping Info</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center sm:text-left">
            <h3 className="text-[10px] font-black mb-8 uppercase tracking-[0.2em] text-yellow-500">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-6 font-medium">Join for exclusive discounts and new dish alerts.</p>
            <form className="relative group max-w-sm mx-auto sm:mx-0" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all outline-none shadow-inner"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 p-3 rounded-xl text-white hover:bg-yellow-600 transition-colors shadow-lg active:scale-95">
                <FaEnvelope size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="text-gray-500 text-[11px] font-bold uppercase tracking-wider">
            © {new Date().getFullYear()} <span className="text-gray-300">Foodish Inc.</span> Crafted for foodies.
          </div>
          <div className="flex space-x-6 sm:space-x-8 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
            <a href="#" className="hover:text-yellow-500 transition-colors">Support</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Security</a>
            <a href="#" className="hover:text-yellow-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;