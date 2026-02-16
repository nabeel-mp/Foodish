import React, { useEffect } from 'react';
import { FaUtensils, FaMotorcycle, FaWallet, FaStar } from 'react-icons/fa6';
import AOS from "aos";
import "aos/dist/aos.css";

const services = [
  {
    id: 1,
    icon: <FaUtensils className="text-3xl text-yellow-400" />,
    title: "Freshly Cooked",
    description: "Every meal is prepared fresh using high-quality ingredients to ensure authentic taste and hygiene.",
    aos: "fade-up",
  },
  {
    id: 2,
    icon: <FaMotorcycle className="text-3xl text-yellow-400" />,
    title: "Fast Delivery",
    description: "Your food reaches you hot and on time with our lightning-fast delivery service.",
    aos: "fade-up",
  },
  {
    id: 3,
    icon: <FaWallet className="text-3xl text-yellow-400" />,
    title: "Affordable Prices",
    description: "Delicious biriyani doesn't have to be expensive. Enjoy pocket-friendly meals daily.",
    aos: "fade-up",
  },
  {
    id: 4,
    icon: <FaStar className="text-3xl text-yellow-400" />,
    title: "Top Rated Taste",
    description: "Our biriyani is loved by thousands — rated 4.9/5 by happy foodies across town.",
    aos: "fade-up",
  },
];

const Service = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 px-4 sm:px-6 lg:px-20">
      {/* Heading Section */}
      <div
        className="max-w-7xl mx-auto text-center mb-12"
        data-aos="zoom-in"
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-yellow-400 mb-7 mt-4">
          Our Services
        </h2>
        <p className="text-gray-300 text-base sm:text-lg">
          We ensure top-notch quality and customer satisfaction in every meal and every order.
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:shadow-xl hover:scale-105 transition-all duration-300"
            data-aos={service.aos}
            data-aos-delay={index * 200} // stagger effect
          >
            <div className="mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">
              {service.title}
            </h3>
            <p className="text-sm text-gray-200">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
