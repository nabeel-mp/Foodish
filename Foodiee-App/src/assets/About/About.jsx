import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const About = () => {
  useEffect(() => {
    AOS.init({ duration: 1200, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Title Animation */}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6"
          data-aos="fade-up"
        >
          About Us
        </h2>

        {/* First Paragraph */}
        <p
          className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed"
          data-aos="fade-right"
        >
          Welcome to{" "}
          <span className="text-yellow-500 font-semibold">foodish.</span> — your
          go-to place for authentic biriyani and quick bites. We combine
          tradition with convenience, bringing you freshly made dishes,
          lightning-fast delivery, and prices that don’t break the bank.
        </p>

        {/* Second Paragraph */}
        <p
          className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto"
          data-aos="fade-right"
        >
          Founded with a passion for flavor and service, we aim to deliver not
          just food, but an experience. Whether you're craving biriyani,
          burgers, or desserts, we have something to satisfy every craving.
        </p>
      </div>
    </div>
  );
};

export default About;
