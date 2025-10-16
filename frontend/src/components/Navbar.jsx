/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
} from "react-icons/fi";
import React from "react";
import Logo from "../assets/coffe_logo2.png"; // Assuming a coffee-themed logo; update path as needed

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

  const socialLinks = [
    { icon: FiFacebook, href: "https://www.facebook.com/coffeeking" },
    { icon: FiTwitter, href: "https://x.com/coffeeking" },
    { icon: FiInstagram, href: "https://www.instagram.com/coffeeking" },
    { icon: FiLinkedin, href: "https://www.linkedin.com/company/coffeeking" },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <style>{`
        .nav-transition {
          transition: all 0.4s ease;
        }
        .nav-link {
          position: relative;
          overflow: hidden;
        }
        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #c0aa83, #a38e6a);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::before {
          width: 100%;
        }
      `}</style>

      <header className="fixed top-0 left-0 w-full z-50">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-[#c0aa83] via-[#a38e6a] to-[#c0aa83] text-white py-2 px-4 hidden lg:block pl-12 pr-10">
          <div className="container mx-auto flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a
                href="tel:+1234567890"
                className="flex items-center space-x-2 hover:text-[#f2e0bf] transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>+1 (234) 567-890</span>
              </a>
              <p>|</p>
              <a
                href="mailto:info@coffeeking.com"
                className="flex items-center space-x-2 hover:text-[#f2e0bf] transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span>info@coffeeking.com</span>
              </a>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>Kigali, Rwanda</span> {/* Kept location; change if needed */}
              </div>
              <p>|</p>
              {socialLinks.map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#f2e0bf] transition-all hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav
          className={`shadow-md nav-transition ${
            scrolled
              ? "bg-white text-gray-900"
              : "bg-gradient-to-r from-[#c0aa83] via-[#a38e6a] to-[#c0aa83] text-white"
          }`}
        >
          <div className="container mx-auto flex justify-between items-center px-4 py-3 lg:py-4 pl-12 pr-10">
            {/* Logo */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
              <img
                src={Logo}
                alt="CoffeeKing Logo"
                className={`object-contain transition-all duration-300 ${
                  scrolled ? "h-12" : "h-14"
                }`}
              />
            </div>

            {/* Nav Links */}
            <ul className="hidden lg:flex lg:space-x-2 lg:items-center absolute left-1/2 transform -translate-x-1/2">
              {[
                { name: "Home", path: "/" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Our Services", path: "/services" },
                  { name: "Blogs", path: "/blogs" },
                  { name: "Contact Us", path: "/contact-us" },
              ].map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link block px-4 py-2 text-base font-semibold capitalize transition-all duration-200 rounded-lg ${
                        scrolled
                          ? isActive
                            ? "text-[#c0aa83]"
                            : "text-gray-700 hover:text-[#c0aa83]"
                          : isActive
                          ? "text-[#f2e0bf]"
                          : "text-white hover:text-[#f2e0bf]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Contact / Mobile Button */}
            <div className="flex items-center bg-white p-2 rounded-md w-36 text-[#c0aa83]">
              <div className="hidden lg:block ml-4">
                <NavLink
                  to="/products"
                  className={`block text-base font-bold transition-all duration-200 ${
                    scrolled
                      ? "text-[#c0aa83] hover:text-[#a38e6a]"
                      : "text-[#c0aa83] hover:text-[#a38e6a]"
                  }`}
                >
                  Shop Now
                </NavLink>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? "text-gray-800 hover:text-[#c0aa83]"
                      : "text-white hover:text-[#f2e0bf]"
                  }`}
                >
                  {menuOpen ? (
                    <FiX className="w-7 h-7" />
                  ) : (
                    <FiMenu className="w-7 h-7" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Overlay */}
        {menuOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black bg-opacity-60 z-30 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <div className="lg:hidden fixed top-0 left-0 w-4/5 max-w-sm h-full bg-gradient-to-br from-[#c0aa83] via-[#a38e6a] to-[#8c7452] z-40 slide-in-animation shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-white border-opacity-10">
                <img src={Logo} alt="CoffeeKing Logo" className="h-12 w-auto object-contain" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-[#f2e0bf] transition-all p-2"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col p-6 space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about" },
                  { name: "Products", path: "/products" },
                  { name: "Blog", path: "/blog" },
                  { name: "Contact", path: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-base font-semibold text-white hover:text-[#f2e0bf] transition-colors duration-200"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white border-opacity-10">
                <div className="flex justify-center space-x-6">
                  {socialLinks.map(({ icon: Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-[#f2e0bf] transition-all hover:scale-110"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}

export default NavBar;