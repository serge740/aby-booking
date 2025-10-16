import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

import Splash from '../../assets/images/splash.jpg'

const ContentReach = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (

<section className="hidden md:block relative h-[400px] text-white py-16 px-8 bg-cover bg-center">
  {/* Background with Overlay */}
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${Splash})`,
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
    }}
  ></div>

  {/* Content */}
  <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
    {/* Left Side - Heading & Description */}
    <div className="md:w-2/3 -ml-16">
      <h2 className="text-4xl font-bold leading-tight">
        <span className="text-primary-500">Build Your Future in Web Development</span>
        <br /> Craft powerful, scalable, and innovative websites.
      </h2>
      <p className="text-gray-300 mt-4 max-w-xl leading-10">
        Whether you're just starting out or looking to enhance your skills, we provide expert guidance, real-world projects, and career opportunities to help you thrive in the web development industry.
      </p>
    </div>

    {/* Right Side - Call to Action Buttons */}
    <div className="md:w-1/3 ml-40 flex flex-col gap-4 mt-6 md:mt-0">
      <button className="border border-white text-white py-2 mb-6 px-6 rounded-lg hover:bg-white hover:text-black transition">
        Start Your Journey
      </button>
      <button className="bg-primary-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition">
        Advance Your Skills
      </button>
    </div>
  </div>
</section>

);
};

export default ContentReach;
