import React, { lazy, useEffect } from "react";
import Menu from "../components/home/Menu";
import Header from "../components/header";


const MenuPage = () => {

  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 text-center min-h-screen">
      <Header title={`our menu`} path={`menu`} />
      
      {/* Menu Introduction Section */}
    <div className="py-16 md:py-10 px-6 max-w-5xl mx-auto">
  <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
    Our <span className="text-primary-500">Restaurant Menu</span>
  </h2>
  <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
    Welcome to our Kigali kitchen! We serve mouth-watering burgers, cheesy pizzas, 
    fresh salads, and local Rwandan specialties prepared with love and the finest ingredients. 
    Every dish is crafted to delight your taste buds.
  </p>
  <p className="text-base md:text-lg text-gray-500">
    From juicy gourmet burgers to classic wood-fired pizzas, our menu brings together 
    international flavors and local Rwandan ingredients — perfect for lunch, dinner, or a casual weekend treat.
  </p>
</div>

      <Menu />
    </section>
  );
};

export default MenuPage;