import React, { useEffect } from 'react';
import { FaUtensils, FaMotorcycle, FaWallet, FaStar } from 'react-icons/fa6';
import AOS from "aos";
import "aos/dist/aos.css";

const services = [
  {
    id: 1,
    icon: <FaUtensils className="text-4xl text-white" />,
    title: "Freshly Cooked",
    description: "Every meal is prepared fresh using high-quality ingredients for authentic taste.",
    color: "bg-orange-500"
  },
  {
    id: 2,
    icon: <FaMotorcycle className="text-4xl text-white" />,
    title: "Fast Delivery",
    description: "Lightning-fast delivery ensures your food reaches you hot and fresh.",
    color: "bg-yellow-500"
  },
  {
    id: 3,
    icon: <FaWallet className="text-4xl text-white" />,
    title: "Best Prices",
    description: "Delicious gourmet meals that are friendly to your pocket.",
    color: "bg-green-500"
  },
  {
    id: 4,
    icon: <FaStar className="text-4xl text-white" />,
    title: "Top Rated",
    description: "Rated 4.9/5 by thousands of happy foodies across the city.",
    color: "bg-red-500"
  },
];

const Service = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-200 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16" data-aos="fade-up">
          <p className="font-script text-yellow-600 text-2xl mb-2">Why Choose Us</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            We Serve The Best <span className="text-yellow-500">Quality Food</span>
          </h2>
          <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 150}
            >
              {/* Hover Circle Animation */}
              <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${service.color} opacity-10 group-hover:scale-[10] transition-transform duration-500 ease-in-out`}></div>

              <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 shadow-md transform group-hover:rotate-6 transition-transform duration-300 relative z-10`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-gray-900 relative z-10">
                {service.title}
              </h3>
              <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 relative z-10">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;