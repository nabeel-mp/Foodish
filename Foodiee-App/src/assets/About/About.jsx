import React, { useEffect } from "react";
import AOS from "aos";
import { useNavigate } from 'react-router-dom';
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaUtensils, FaTruck, FaLeaf, FaUsers } from "react-icons/fa";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const features = [
    { icon: <FaUtensils />, title: "Premium Chefs", desc: "Top-tier culinary experts." },
    { icon: <FaLeaf />, title: "Fresh Organic", desc: "100% farm-sourced items." },
    { icon: <FaTruck />, title: "Fast Delivery", desc: "Under 30 mins delivery." },
    { icon: <FaUsers />, title: "Community", desc: "Loved by 50k+ foodies." },
  ];

    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      
      {/* --- Section 1: Hero Story --- */}
      <section className="py-24 lg:py-32 relative">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-50/50 rounded-l-[100px] -z-10 hidden lg:block" />
        
        <div className="container mx-auto px-6 lg:px-16">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Visual Side: Layered Images */}
            <div className="lg:w-1/2 relative" data-aos="zoom-in-right">
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <motion.div 
                  className="rounded-[2rem] h-80 shadow-2xl overflow-hidden border-8 border-white"
                  whileHover={{ y: -10 }}
                >
                  <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80" alt="Food" className="w-full h-full object-cover" />
                </motion.div>
                <motion.div 
                  className="rounded-[2rem] h-80 shadow-2xl overflow-hidden border-8 border-white mt-12"
                  whileHover={{ y: -10 }}
                >
                  <img src="https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80" alt="Cooking" className="w-full h-full object-cover" />
                </motion.div>
              </div>
              
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -right-6 md:right-0 bg-white p-6 rounded-3xl shadow-2xl z-20 flex items-center gap-4 border border-gray-100"
              >
                <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl">
                  <FaUtensils />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-xl">100%</p>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">Authentic Taste</p>
                </div>
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="lg:w-1/2 space-y-8" data-aos="fade-left">
              <div>
                <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full font-black uppercase tracking-widest text-xs">
                  Our Culinary Journey
                </span>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mt-6 leading-[1.1]">
                  Cooking with <span className="text-yellow-500 italic">Soul</span> Since 2014.
                </h2>
              </div>
              
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                At <span className="text-gray-900 font-bold underline decoration-yellow-400 decoration-4">foodish.</span>, we don't just serve meals; we serve experiences. Our journey began in a small kitchen with one goal: to redefine how people experience fast food.
              </p>

              <div className="grid grid-cols-2 gap-8 py-4">
                 <div className="group">
                    <h4 className="font-black text-4xl text-gray-900 group-hover:text-yellow-500 transition-colors">10+</h4>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">Years of Magic</p>
                 </div>
                 <div className="group">
                    <h4 className="font-black text-4xl text-gray-900 group-hover:text-yellow-500 transition-colors">50k+</h4>
                    <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">Happy Souls</p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                onClick={() => navigate("/menu")}
                className="bg-gray-900 text-white px-10 py-4 rounded-2xl hover:bg-yellow-500 transition-all duration-300 font-bold shadow-xl shadow-gray-200 active:scale-95"
                >
                  Our Menu
                </button>
                <button 
                onClick={()=> navigate("/contact")}
                className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-2xl hover:border-yellow-500 transition-all duration-300 font-bold active:scale-95">
                  Contact Us
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Section 2: Features Grid --- */}
      <section className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Why Choose Foodish?</h3>
            <p className="text-gray-500 font-medium">We combine health, taste, and speed into every single box we deliver to your home.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-50 flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500 text-2xl mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-500 shadow-inner">
                  {f.icon}
                </div>
                <h4 className="font-black text-gray-900 text-lg mb-2">{f.title}</h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Call to Action --- */}
      <section className="py-20 px-6">
        <div 
          className="max-w-7xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center"
          data-aos="zoom-in"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">
            Ready to taste the <span className="text-yellow-500">Difference?</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto relative z-10 font-medium">
            Join thousands of satisfied customers and treat yourself to the best food in town.
          </p>
          <button
          onClick={()=> navigate("/menu")}
          className="relative z-10 bg-yellow-500 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-white hover:text-gray-900 transition-all duration-500 shadow-2xl active:scale-95">
            Order Your Meal Now
          </button>
        </div>
      </section>

    </div>
  );
};

export default About;