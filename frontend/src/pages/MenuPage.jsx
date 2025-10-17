import React, { lazy, useEffect } from "react";
import Menu from "../components/home/Menu";
import Header from "../components/header";


const MenuPage = () => {

  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 text-center min-h-screen">
      <Header title={`our menu`} path={`menu`} />
      
      {/* Menu Introduction Section */}
      <div className="py-16 md:py-24 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Our Coffee <span className="text-primary-500"> Shop Menu</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-4">
          Welcome to our cozy coffee shop! We serve freshly brewed coffee, artisanal lattes, 
          and delicious breakfast treats to start your day right. Every cup is crafted with 
          passion and the finest beans.
        </p>
        <p className="text-base md:text-lg text-gray-500">
          Whether you're craving a perfectly brewed espresso or a warm breakfast bite, 
          we've created the perfect menu for coffee lovers.
        </p>
      </div>
      
      <Menu />
    </section>
  );
};

export default MenuPage;