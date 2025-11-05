import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about-us" },
    { name: "Our Menu", path: "/menu" },
    { name: "Reviews", path: "/reviews" },
    { name: "Blogs", path: "/blogs" },
    { name: "Contact Us", path: "/contact-us" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500  ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-white/10 backdrop-blur-sm"
      }`}
    >
      <nav className="w-full flex justify-between items-center px-6 lg:px-12 py-4 relative">
        {/* Left: Logo */}
        <NavLink
          to="/"
          className={`text-2xl font-bold tracking-wide transition-colors duration-300 ${
            scrolled ? "text-black" : "text-white"
          }`}
        >
          Aby Booking
        </NavLink>

        {/* Center: Nav Links */}
        <ul className="hidden lg:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          {navLinks.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-base font-medium transition-colors duration-300 ${
                    scrolled
                      ? isActive
                        ? "text-primary-500"
                        : "text-black hover:text-primary-500"
                      : isActive
                      ? "text-primary-400"
                      : "text-white hover:text-primary-400"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: Reservation + Mobile Menu */}
        <div className="flex items-center space-x-4">
          <NavLink
            to="/contact-us"
            className={`hidden lg:inline-block px-6 py-2 rounded-full font-medium transition-all duration-300 ${
              scrolled
                ? "bg-primary-500 text-white hover:bg-primary-600"
                : "border border-white text-white hover:bg-white hover:text-black"
            }`}
          >
            Reservation
          </NavLink>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`lg:hidden p-2 rounded-md transition-colors duration-300 ${
              scrolled ? "text-black" : "text-white"
            }`}
          >
            {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm">
          <div className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white/95 backdrop-blur-lg shadow-2xl z-50 p-6 flex flex-col">
            <button
              onClick={() => setMenuOpen(false)}
              className="self-end text-black mb-4"
            >
              <FiX size={26} />
            </button>
            <ul className="flex flex-col space-y-5">
              {navLinks.map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="text-black font-medium text-lg hover:text-primary-500 transition-colors"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
            <NavLink
              to="/contact-us"
              onClick={() => setMenuOpen(false)}
              className="mt-8 block text-center bg-primary-500 text-white py-3 rounded-full font-medium hover:bg-primary-600 transition-all"
            >
              Reservation
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
