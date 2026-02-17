import React, { useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import AOS from "aos";
import "aos/dist/aos.css";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaClock } from 'react-icons/fa';

const Contact = () => {
  const form = useRef();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // EmailJS logic
    emailjs.sendForm("service_1qah7m4", "template_27jn438", form.current, "VsQK7wKZhblZ9tmW_")
      .then((res) => {
        alert("Message sent Successfully!!");
        form.current.reset();
      }, (err) => {
        alert("Failed to Send message");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-16 px-4 overflow-hidden relative">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200/30 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-100/40 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="container max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-black uppercase tracking-widest text-xs">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-6">
            Let's Start a <span className="text-yellow-500 italic">Conversation</span>
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto font-medium">
            Have a question about our menu, delivery, or catering? Our team is here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Side: Contact Cards */}
          <div className="lg:col-span-1 space-y-6" data-aos="fade-right">
            
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:bg-gray-900 transition-all duration-500">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                <FaMapMarkerAlt size={20} />
              </div>
              <h4 className="font-black text-gray-900 group-hover:text-white mb-2 uppercase tracking-tighter text-sm">Our Location</h4>
              <p className="text-gray-500 group-hover:text-gray-400 text-sm leading-relaxed">
                KL10 Food Street, Manjeri Town, <br />Malappuram, KERALA
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:bg-gray-900 transition-all duration-500">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                <FaPhoneAlt size={20} />
              </div>
              <h4 className="font-black text-gray-900 group-hover:text-white mb-2 uppercase tracking-tighter text-sm">Call Us</h4>
              <p className="text-gray-500 group-hover:text-gray-400 text-sm">+91 7736110727</p>
              <p className="text-gray-500 group-hover:text-gray-400 text-sm">+91 9887655875</p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 group hover:bg-gray-900 transition-all duration-500">
              <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-500 mb-6 group-hover:bg-yellow-500 group-hover:text-white transition-all">
                <FaClock size={20} />
              </div>
              <h4 className="font-black text-gray-900 group-hover:text-white mb-2 uppercase tracking-tighter text-sm">Working Hours</h4>
              <p className="text-gray-500 group-hover:text-gray-400 text-sm">Mon - Sun: 09:00 AM - 11:00 PM</p>
            </div>

          </div>

          {/* Right Side: Modern Form */}
          <div className="lg:col-span-2" data-aos="fade-left">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl shadow-gray-200/60 border border-gray-50">
              <form ref={form} onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 ml-2 tracking-widest">Full Name</label>
                    <input
                      type="text"
                      name="user_name"
                      required
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase text-gray-400 ml-2 tracking-widest">Email Address</label>
                    <input
                      type="email"
                      name="user_email"
                      required
                      placeholder="name@example.com"
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-2 tracking-widest">Your Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    required
                    placeholder="Tell us how we can help..."
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-yellow-500 transition-all outline-none text-gray-700 font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white font-black py-5 rounded-2xl hover:bg-yellow-500 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl active:scale-95 transform"
                >
                  <FaPaperPlane className="text-sm" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Optional: Embedded Map or Social Banner */}
        {/* <div className="mt-20 rounded-[3rem] overflow-hidden shadow-2xl h-80 border-8 border-white" data-aos="zoom-in">
           <iframe 
             title="location"
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1422937611493!2d-73.98731968459418!3d40.75889497932681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1625501300000!5m2!1sen!2sus" 
             className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000"
             allowFullScreen="" 
             loading="lazy"
           ></iframe>
        </div> */}
      </div>
    </div>
  );
};

export default Contact;