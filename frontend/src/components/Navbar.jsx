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
import Logo from "../assets/trans.png";

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
  { icon: FiFacebook, href: "https://www.facebook.com/profile.php?id=61561463187987" },
  { icon: FiTwitter, href: "https://x.com/AbytechHUB" },
  { icon: FiInstagram, href: "https://www.instagram.com/explore/locations/383650954824335/abytech-hub/?hl=en" },
  { icon: FiLinkedin, href: "https://www.linkedin.com/in/abytech-hub-754226354/" },
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
          background: linear-gradient(90deg, #7e22ce, #2563eb);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::before {
          width: 100%;
        }
      `}</style>

      <header className="fixed top-0 left-0 w-full z-50">
        {/* Top Info Bar */}
        <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white py-2 px-4 hidden lg:block pl-12 pr-10">
          <div className="container mx-auto flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a
                href="tel:+250788888888"
                className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>+250 791813289</span>
              </a>
              <p>|</p>
              <a
                href="mailto:info@company.com"
                className="flex items-center space-x-2 hover:text-blue-300 transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span>info@abytechhub.com</span>
              </a>
                 
            </div>

            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>Kigali, Rwanda</span>
              </div>
              <p>|</p>
                    {socialLinks.map(({ icon: Icon, href }, i) => (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-blue-300 transition-all hover:scale-110"
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
              : "bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 text-white"
          }`}
        >
          <div className="container mx-auto flex justify-between items-center px-4 py-3 lg:py-4 pl-12 pr-10">
            {/* Logo */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
              <img
                src={Logo}
                alt="Brand Logo"
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
                { name: "Team", path: "/team-member" },
                { name: "Blogs", path: "/blogs" },
                { name: "Project", path: "/project" },
                { name: "Contact Us", path: "/contact-us" },
              ].map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link block px-4 py-2 text-base font-semibold capitalize transition-all duration-200 rounded-lg ${
                        scrolled
                          ? isActive
                            ? "text-blue-700"
                            : "text-gray-700 hover:text-blue-700"
                          : isActive
                          ? "text-blue-200"
                          : "text-white hover:text-blue-200"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Contact / Mobile Button */}
            <div className="flex items-center bg-white p-2 rounded-md w-36 text-blue-800">
              <div className="hidden lg:block ml-4">
                <NavLink
                  to="/contact-us"
                  className={`block text-base font-bold transition-all duration-200 ${
                    scrolled
                      ? "text-blue-700 hover:text-blue-500"
                      : "text-blue-700 hover:text-blue-500 "
                  }`}
                >
                  Get Quote
                </NavLink>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    scrolled
                      ? "text-gray-800 hover:text-blue-700"
                      : "text-white hover:text-blue-200"
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
            <div className="lg:hidden fixed top-0 left-0 w-4/5 max-w-sm h-full bg-gradient-to-br from-purple-900 via-blue-900 to-blue-800 z-40 slide-in-animation shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-white border-opacity-10">
                <img src={Logo} alt="Brand Logo" className="h-12 w-auto object-contain" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-blue-300 transition-all p-2"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col p-6 space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Our Services", path: "/services" },
                  { name: "Team", path: "/team-member" },
                  { name: "Blogs", path: "/blogs" },
                  { name: "Project", path: "/project" },
                  { name: "Contact Us", path: "/contact-us" },
                ].map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-base font-semibold text-white hover:text-blue-300 transition-colors duration-200"
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
          className="text-white hover:text-blue-300 transition-all hover:scale-110"
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
