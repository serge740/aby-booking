import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiPhone,
  FiMail,
  FiHeart,
  FiShoppingCart,
} from "react-icons/fi";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {cartItems:cart} = useCart()
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Our Services", path: "/services" },
    { name: "Shops", path: "/partners" },
    // { name: "Reviews", path: "/Reviews" },
     { name: "News & Updates ", path: "/blogs" },
    { name: "Our gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <>
      {/* TOP BAR - Disappears on scroll */}
      <div
        className={`bg-gradient-to-br from-red-600 to-orange-500 text-white transition-all duration-500 overflow-hidden px-6 ${
          scrolled ? "h-0 py-0 opacity-0" : "py-2 h-auto opacity-100"
        }`}
      >
        <div className="menuItem mx-auto flex flex-col lg:flex-row items-center justify-between px-4 gap-3 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="mailto:support@aby dash.com" className="flex items-center gap-1 hover:underline">
              <FiMail className="w-4 h-4" /> support@aby dash.com
            </a>
            <a href="tel:+18005551234" className="flex items-center gap-1 hover:underline">
              <FiPhone className="w-4 h-4" /> +1 800-555-1234
            </a>
          </div>

          <div className="font-medium hidden sm:block">
            Super Value Deals – Save more with coupons
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <a href="#" className="hover:text-gray-200"><FaFacebookF size={14} /></a>
              <a href="#" className="hover:text-gray-200"><FaTwitter size={14} /></a>
              <a href="#" className="hover:text-gray-200"><FaInstagram size={14} /></a>
              <a href="#" className="hover:text-gray-200"><FaLinkedinIn size={14} /></a>
            </div>
            <div className="flex gap-2 text-xs">
              <NavLink to="/signin" className="hover:underline">Sign In</NavLink>
              <span>|</span>
              <NavLink to="/signup" className="hover:underline">Sign Up</NavLink>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER - Sticky, changes on scroll */}
      <header
        className={`sticky top-0 z-50 bg-white shadow-md transition-all duration-500 px-6 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="menuItem mx-auto px-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="p-2 bg-orange-500 text-white rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className={`font-bold text-gray-900 ${scrolled ? "text-lg" : "text-xl"}`}>
                ABY DASH
              </span>
            </NavLink>

            {/* CENTER: Nav Links only on scroll (lg+) */}
            <nav
              className={`hidden lg:flex flex-1 max-w-2xl mx-4 lg:mx-8 items-center justify-center gap-6 ${
                scrolled ? "flex" : "hidden"
              }`}
            >
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive ? "text-orange-500" : "text-gray-700 hover:text-orange-500"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Wishlist & Cart */}
            <div className={`flex items-center gap-6 ${scrolled ? "pl-8" : "pl-0"} transition-all duration-300`}>
              <NavLink to="/wishlist" className="relative group">
                <FiHeart className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </NavLink>
              <NavLink to="/cart" className="relative group">
                <FiShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-orange-500 transition" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart?.length > 0 ? cart.length : 0}
                </span>
              </NavLink>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden text-gray-700"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>
      </header>

      {/* BOTTOM NAV: Categories + SEARCH (centered) + Hotline - Hidden on scroll */}
      <nav
        className={`bg-gray-50 border-t transition-all duration-500 overflow-hidden px-6 ${
          scrolled ? "h-0 py-0 opacity-0" : "py-3 opacity-100"
        }`}
      >
        <div className="menuItem mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* All Categories */}
          <button className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-orange-600 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All Categories
          </button>

          {/* SEARCH BAR - Centered between Categories & Hotline */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Hotline */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FiPhone className="text-orange-500 w-4 h-4" />
            <span>Hotline:</span>
            <a href="tel:18005551234" className="font-medium text-orange-500 hover:underline">
              1800-555-1234
            </a>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col pt-20 lg:hidden">
          <div className="bg-white w-full h-full overflow-y-auto p-6">
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end mb-6 text-gray-700"
            >
              <FiX size={28} />
            </button>

            <ul className="space-y-5 mb-8">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg font-medium text-gray-800 hover:text-orange-500 transition"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="border-t pt-6 space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <FiMail className="text-orange-500" /> support@aby dash.com
              </p>
              <p className="flex items-center gap-2">
                <FiPhone className="text-orange-500" /> +1 800-555-1234
              </p>
              <div className="flex gap-3 pt-4">
                <a href="#" className="text-gray-600 hover:text-orange-500"><FaFacebookF /></a>
                <a href="#" className="text-gray-600 hover:text-orange-500"><FaTwitter /></a>
                <a href="#" className="text-gray-600 hover:text-orange-500"><FaInstagram /></a>
                <a href="#" className="text-gray-600 hover:text-orange-500"><FaLinkedinIn /></a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;