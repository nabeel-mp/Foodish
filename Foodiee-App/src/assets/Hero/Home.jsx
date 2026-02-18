import React, { useEffect } from 'react';
import AOS from "aos";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import Service from '../services/service';
import About from '../About/About';
import Contact from '../Contact/Contact';
import Burger from './burgeranim.jpeg';
import pizza from './pizza.png';
import biriyani from './biriyani1-Photoroom.png';

// High-quality food background video (Free to use from Pexels/Pixabay)
const videoSrc = "https://videos.pexels.com/video-files/2928578/2928578-uhd_2560_1440_24fps.mp4"; 

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          {/* White/Yellow Overlay - The Magic Layer */}
          <div className="absolute inset-0 bg-white/80 md:bg-white/70 bg-gradient-to-r from-white via-white/80 to-yellow-100/50 backdrop-blur-sm z-0"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            
            {/* Left Text Content */}
            <div className="text-center lg:text-left space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="font-script text-yellow-600 text-3xl md:text-4xl block mb-2">Are you hungry?</span>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                  Don't Wait! <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                    Let's Eat
                  </span>
                </h1>
              </motion.div>

              <p className="text-gray-600 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 font-medium" data-aos="fade-up" data-aos-delay="200">
                Experience the authentic taste of <span className="font-bold text-gray-800">foodish.</span> Delivered fresh, hot, and delicious straight to your doorstep.
              </p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={() => navigate("/menu")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-yellow-500/50 transform hover:-translate-y-1 transition-all duration-300 text-lg"
                >
                  Order Now
                </button>
                <button 
                onClick ={()=> navigate("/menu")}
                className="px-8 py-4 rounded-full font-bold text-gray-700 border-2 border-gray-300 hover:border-yellow-500 hover:text-yellow-600 transition-all duration-300">
                  View Menu
                </button>
              </motion.div>
            </div>

            {/* Right Animated Food Composition */}
            <div className="relative h-[400px] md:h-[500px] w-full flex justify-center items-center">
              {/* Background Blob */}
              <div className="absolute w-[300px] h-[300px] bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>

              {/* Main Dish (Biriyani) */}
              <motion.img
                src={biriyani}
                alt="Biriyani"
                className="w-64 md:w-96 relative z-20 drop-shadow-2xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              />

              {/* Floating Burger */}
              <motion.img
                src={Burger}
                alt="Burger"
                className="absolute top-0 right-0 md:right-10 w-24 md:w-32 drop-shadow-xl z-30"
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Floating Pizza */}
              <motion.img
                src={pizza}
                alt="Pizza"
                className="absolute bottom-0 left-0 md:left-10 w-28 md:w-40 drop-shadow-xl z-30"
                animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </div>

          </div>
        </div>
      </div>

      {/* Sections */}
      <Service />
      <About />
      <Contact />
    </>
  );
};

export default Home;