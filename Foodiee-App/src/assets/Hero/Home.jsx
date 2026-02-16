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

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: false,
    });
  }, []);

  const navigate = useNavigate();

  const handleOrderbtn = () => {
    navigate("/menu");
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen flex items-center text-white overflow-hidden pt-20 sm:pt-24 lg:pt-28">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-0" />

        <div 
          className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-10 lg:gap-16">
            
            {/* Left Content */}
            <div className="text-center md:text-left space-y-6" data-aos="fade-right">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-yellow-400 leading-tight">
                <motion.span
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                >
                  Welcome to <span className="text-white">foodish.</span> Restaurant
                </motion.span>
              </h1>

              <h3 className="text-base sm:text-lg md:text-xl text-yellow-400 font-semibold">
                Your Favorite Food, Delivered Fast!
              </h3>

              <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-xl mx-auto md:mx-0">
                Craving something delicious? Explore a wide range of mouthwatering meals from your favorite restaurants. 
                Fast delivery, fresh ingredients, and flavors you’ll love — all in one place.
                <br />
                Order now and satisfy your hunger with just a few clicks!
              </p>

              <motion.button
                onClick={handleOrderbtn}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-yellow-300 text-black px-6 py-3 rounded-full hover:scale-105 transition-transform duration-200 font-semibold shadow-lg text-base sm:text-lg"
              >
                Order Now
              </motion.button>
            </div>

            {/* Right Animated Images */}
            {/* Right Animated Images */}
{/* Right Animated Images */}
<div 
  className="mt-10 md:mt-0 relative flex justify-center items-center w-full"
  data-aos="zoom-in"
>
  {/* Main Biriyani */}
  <motion.img
    src={biriyani}
    alt="Biriyani"
    className="w-32 sm:w-44 md:w-56 lg:w-72 xl:w-80 relative z-20 drop-shadow-2xl rounded-2xl max-w-full object-contain"
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: [0, -10, 0], opacity: 1 }} // smaller float on mobile
    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
  />

  <motion.img
  src={Burger}
  alt="Burger"
  className="
    w-16 sm:w-24 md:w-28 lg:w-36    
    absolute
    -top-8 sm:-top-12 md:-top-14   
    left-4 sm:left-6 md:-left-12   
    rotate-[-12deg]
    drop-shadow-lg
    max-w-full 
    object-contain
  "
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: [0, -10, 0], opacity: 1 }}   // floating effect
  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
/>



  {/* Pizza */}
{/* Pizza (Hidden on Mobile, Show from md and above) */}
<motion.img
  src={pizza}
  alt="Pizza"
  className="
    hidden md:block
    w-20 sm:w-28 md:w-36 lg:w-44
    absolute
    -bottom-12
    -right-16
    rotate-[10deg]
    drop-shadow-lg max-w-full object-contain
  "
  initial={{ scale: 0.9, opacity: 0 }}
  animate={{ scale: [1, 1.08, 1], opacity: 1 }}
  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
/>


</div>



          </div>
        </div>
      </div>

      {/* Other Sections */}
      <Service />
      <About />
      <Contact />
    </>
  );
};

export default Home;
