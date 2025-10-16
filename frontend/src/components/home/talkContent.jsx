import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";

export default function ContentSection() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-gray-900 text-white py-16 px-6 md:px-12 flex items-center justify-center" data-aos="fade-down">
      <div className="max-w-6xl flex flex-col md:flex-row items-center">
        
        {/* Left Section - Image */}
        <div 
          className="relative w-full md:w-1/2 flex justify-center"
          
        >
          <img 
            src="../image/footer.png" 
            alt="Woman with Laptop" 
            className="w-[80%] md:w-[90%] rounded-lg shadow-lg"
          />
          <div className="absolute bottom-6 left-6 bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-3">
            {/* Add any overlay text or icons here if needed */}
          </div>
        </div>

        {/* Right Section - Content */}
        <div 
          className="w-full md:w-1/2 text-left mt-10 md:mt-0 md:ml-8"
         
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Packages <span className="text-yellow-400">Softwares</span>, Sells For You.
          </h2>
          <p className="mt-4 text-gray-300">
            We deliver high-quality software and web applications with top-tier functionality.
          </p>
          <ul className="mt-6 space-y-3">
            <li className="flex items-center">
              <FaRegCheckCircle className="text-yellow-400 mr-2" /> We Create Software Applications.
            </li>
            <li className="flex items-center">
              <FaRegCheckCircle className="text-yellow-400 mr-2" /> We Deliver Software Services.
            </li>
            <li className="flex items-center">
              <FaRegCheckCircle className="text-yellow-400 mr-2" /> We Deliver On Time.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
