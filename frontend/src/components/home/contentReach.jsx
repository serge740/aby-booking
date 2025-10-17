/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

import Splash from '../../assets/coffe/inner_parallax.jpg'

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
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5)), url(${Splash})`,
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
        <span className="text-[#6F4E37]">Experience the Art of Coffee Crafting</span>
        <br /> Discover rich flavors and authentic coffee traditions.
      </h2>
      <p className="text-gray-300 mt-4 max-w-xl leading-10">
        At Jambokawa, we source the finest beans from sustainable farms and roast them to perfection. 
        Whether you're a coffee connoisseur or new to specialty coffee, we invite you to explore 
        our carefully curated blends and single-origin selections.
      </p>
    </div>

    {/* Right Side - Call to Action Buttons */}
    <div className="md:w-1/3 ml-40 flex flex-col gap-4 mt-6 md:mt-0">
      <button className="border border-white text-white py-2 mb-6 px-6 rounded-lg hover:bg-white hover:text-black transition">
        View Our Menu
      </button>
      <button className="bg-[#6F4E37] text-white py-2 px-6 rounded-lg hover:bg-[#a8926f] transition">
        Visit Our Shop
      </button>
    </div>
  </div>
</section>

);
};

export default ContentReach;