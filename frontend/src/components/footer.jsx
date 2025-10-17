/* eslint-disable no-unused-vars */
import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { IoMdArrowRoundUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Image from '../assets/coffe/map.png'

const FooterContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-600 text-white relative">
      <section className="py-12 px-6 md:px-8 lg:px-14">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Left Section */}
          <div className="text-left max-w-2xl space-y-6">
            <span className="text-2xl font-semibold text-white bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
              JamboKawa
            </span>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Brewed with <span className="text-[#f2e0bf]">Passion</span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed" style={{ lineHeight: "2" }}>
              Welcome to JamboKawa! We source the finest coffee beans from around the world, crafted by our professional baristas. Explore our range of premium coffee products, visit our many points of sale, or enjoy 24/7 fast delivery. Stay connected for exclusive offers and coffee tips!
            </p>
          </div>

          {/* Right Section - Image */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0">
            <img
              src={Image} // Update with a coffee-themed image (e.g., coffee cup or beans)
              alt="JamboKawa Brew"
              className="w-[450px] lg:w-[550px]  transition duration-500 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <div className="pt-4 pr-18 pl-22 pb-4 border-t border-white/20 bg-black/20 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center px-6 md:px-16 lg:px-14">
        {/* Left Section - Social Media */}
        <div className="flex space-x-4">
          <a
            href="https://www.facebook.com/JamboKawa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-[#a38e6a] text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaFacebookF className="text-lg" />
          </a>

          <a
            href="https://x.com/JamboKawa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-[#a38e6a] text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <RxCross2 className="text-lg" />
          </a>

          <a
            href="https://www.instagram.com/JamboKawa"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-[#a38e6a] text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaInstagram className="text-lg" />
          </a>

          <a
            href="https://wa.me/+1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-[#a38e6a] text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaWhatsapp className="text-lg" />
          </a>

          <a
            href="mailto:info@JamboKawa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-[#a38e6a] text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaEnvelope className="text-lg" />
          </a>
        </div>

        {/* Right Section - Copyright */}
        <p className="text-white/80 text-sm mt-3 md:mt-0">
          &copy; {new Date().getFullYear()} JamboKawa - All Rights Reserved
        </p>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-primary-600 to-[#a38e6a] p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300"
        aria-label="Scroll to Top"
      >
        <IoMdArrowRoundUp className="text-white text-xl" />
      </button>
    </footer>
  );
};

export default FooterContent;