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

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const socialLinks = [
    { icon: FiFacebook, href: "https://www.facebook.com/inf@JamboKawa.com" },
    { icon: FiTwitter, href: "https://x.com/inf@JamboKawa.com" },
    { icon: FiInstagram, href: "https://www.instagram.com/explore/location/inf@JamboKawa.com" },
    { icon: FiLinkedin, href: "https://www.linkedin.com/in/inf@JamboKawa.com" },
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
          background: #6F4E37;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::before {
          width: 100%;
        }
      `}</style>

      <header className="fixed top-0 left-0 w-full z-50">
        {/* Top Info Bar */}
        <div
          className="text-white py-2 px-4 hidden lg:block pl-12 pr-10"
          style={{ backgroundColor: "#6F4E37" }}
        >
          <div className="container mx-auto flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <a
                href="tel:+250791813289"
                className="flex items-center space-x-2 hover:text-white/80 transition-colors"
              >
                <FiPhone className="w-4 h-4" />
                <span>+250 791813289</span>
              </a>
              <p>|</p>
              <a
                href="mailto:inf@JamboKawa.com"
                className="flex items-center space-x-2 hover:text-white/80 transition-colors"
              >
                <FiMail className="w-4 h-4" />
                <span>info@JamboKawa.com</span>
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
                  className="text-white hover:text-white/80 transition-all hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="shadow-md nav-transition bg-white text-[#6F4E37]">
          <div className="container mx-auto flex justify-between items-center px-4 py-3 lg:py-4 pl-12 pr-10">
            {/* Text Logo */}
            <div className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105">
              <h1 className="text-2xl font-bold text-[#6F4E37] tracking-wide">
                JamboKawa
              </h1>
            </div>

            {/* Nav Links */}
            <ul className="hidden lg:flex lg:space-x-2 lg:items-center absolute left-1/2 transform -translate-x-1/2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about-us" },
                { name: "Blogs", path: "/blogs" },
                { name: "Our Menu", path: "/menu" },
                { name: "Contact Us", path: "/contact-us" },
              ].map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link block px-4 py-2 text-base font-semibold capitalize transition-all duration-200 rounded-lg ${
                        isActive
                          ? "text-[#6F4E37] underline underline-offset-4"
                          : "text-[#6F4E37] hover:text-[#a68c64]"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Contact / Mobile Button */}
            <div className="flex items-center bg-[#6F4E37] p-2 rounded-md w-36 text-white">
              <div className="hidden lg:block ml-4">
                <NavLink
                  to="/contact-us"
                  className="block text-base font-bold transition-all duration-200 hover:opacity-80 text-white"
                >
                  Get Quote
                </NavLink>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg transition-all duration-300 text-[#6F4E37] hover:text-[#a68c64]"
                >
                  {menuOpen ? <FiX className="w-7 h-7" /> : <FiMenu className="w-7 h-7" />}
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
            <div
              className="lg:hidden fixed top-0 left-0 w-4/5 max-w-sm h-full z-40 shadow-2xl"
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className="flex justify-between items-center p-6 border-b border-[#6F4E37] text-[#6F4E37]">
                <h1 className="text-xl font-bold">JamboKawa</h1>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-[#6F4E37] hover:text-[#a68c64] transition-all p-2"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col p-6 space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "About Us", path: "/about-us" },
                  { name: "Our Services", path: "/services" },
                  { name: "News and Updates", path: "/news" },
                  { name: "Product", path: "/product" },
                  { name: "Contact Us", path: "/contact-us" },
                ].map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-3 text-base font-semibold text-[#6F4E37] hover:text-[#a68c64] transition-colors duration-200"
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#6F4E37]">
                <div className="flex justify-center space-x-6">
                  {socialLinks.map(({ icon: Icon, href }, i) => (
                    <a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#6F4E37] hover:text-[#a68c64] transition-all hover:scale-110"
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
