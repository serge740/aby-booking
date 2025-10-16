import React from "react";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { IoMdArrowRoundUp } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

const FooterContent = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <footer className="bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 text-white relative">
      <section className="py-12 px-6 md:px-8 lg:px-14">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Left Section */}
          <div className="text-left max-w-2xl space-y-6">
            <span className="text-2xl font-semibold text-white bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
              AbyTech Hub
            </span>
            <h2 className="text-5xl md:text-6xl font-bold leading-tight">
              Let's Work <span className="text-yellow-300">Together</span>
            </h2>
            <p className="text-lg text-white/90 leading-relaxed" style={{lineHeight:"2"}}>
              Thank you for visiting AbyTech Hub! We are dedicated to delivering 
              top-notch technology solutions tailored to your needs. Let's build 
              something great together. Follow us on social media and stay 
              updated with our latest innovations!
            </p>
          </div>

          {/* Right Section - Image */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0">
            <img
              src="../image/landing.png"
              alt="AbyTech Team"
              className="w-[450px] lg:w-[550px] grayscale hover:grayscale-0 transition duration-500 rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Footer Bottom */}
      <div className="pt-4 pr-18 pl-22 pb-4 border-t border-white/20 bg-black/20 backdrop-blur-sm flex flex-col md:flex-row justify-between items-center px-6 md:px-16 lg:px-14">
        {/* Left Section - Social Media */}
        <div className="flex space-x-4">
          <a 
            href="https://x.com/AbytechHUB" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <RxCross2 className="text-lg" />
          </a>

          <a 
            href="https://www.linkedin.com/in/aby-tech-9b8947174/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaLinkedinIn className="text-lg" />
          </a>

          <a 
            href="https://www.instagram.com/abytech_hub/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaInstagram className="text-lg" />
          </a>

          <a 
            href="https://wa.me/+250791813289" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaWhatsapp className="text-lg" />
          </a>

          <a 
            href="mailto:abytechhubllc@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
          >
            <FaEnvelope className="text-lg" />
          </a>
        </div>

        {/* Right Section - Copyright */}
        <p className="text-white/80 text-sm mt-3 md:mt-0">
          &copy; {new Date().getFullYear()} Abytech Hub LTD - All Rights Reserved by Abytech hub Team
        </p>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-full shadow-lg hover:scale-110 hover:shadow-2xl transition-all duration-300"
        aria-label="Scroll to Top"
      >
        <IoMdArrowRoundUp className="text-white text-xl" />
      </button>
    </footer>
  );
};

export default FooterContent;