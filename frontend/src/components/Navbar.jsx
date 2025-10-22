import React, { useState, useEffect } from "react";
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

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
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
          background: #c98347;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-link:hover::before,
        .nav-link.active::before {
          width: 100%;
        }
        .reservation-btn {
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        .reservation-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }
      `}</style>

      <header className="fixed top-5 rounded-2xl overflow-hidden mx-auto  w-29/30 z-50">
        {/* Main Navigation with blur effect */}
        <nav
          className={`nav-transition backdrop-blur-md ${
            scrolled
              ? "bg-black/60"
              : "bg-black/30"
          }`}
        >
          <div className=" mx-auto flex justify-between items-center px-8 py-4 lg:py-5">
            {/* Logo */}
            <div className="flex items-center space-x-3 transition-transform duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-wide text-white">
                Aby Booking
              </h1>
            </div>

            {/* Nav Links - Centered */}
            <ul className="hidden lg:flex lg:space-x-8 lg:items-center absolute left-1/2 transform -translate-x-1/2">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about-us" },
                { name: "Our Menu", path: "/menu" },
                { name: "Reviews", path: "/reviews" },
                { name: "Blogs", path: "/blogs" },
                { name: "Contact Us", path: "/contact-us" },
              ].map((item, index) => (
                <li key={index}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `nav-link block px-2 py-2 text-base font-medium capitalize transition-all duration-200 ${
                        isActive
                          ? "text-primary-400 active"
                          : "text-white hover:text-primary-400"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Reservation Button */}
            <div className="flex items-center space-x-4">
              <div className="hidden lg:block">
                <NavLink
                  to="/contact-us"
                  className="reservation-btn px-6 py-2.5 rounded-full text-white font-medium flex items-center space-x-2"
                >
                  <span>Reservation</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </NavLink>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg transition-all duration-300 text-white hover:bg-white/10"
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
              className="lg:hidden fixed inset-0 bg-black/70 z-30 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <div className="lg:hidden fixed top-0 right-0 w-4/5 max-w-sm h-full z-40 bg-black/95 backdrop-blur-lg shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-white/10">
                <h1 className="text-xl font-bold text-white">Jambokawa</h1>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:text-primary-400 transition-all p-2"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              <ul className="flex flex-col p-6 space-y-2">
                {[
                  { name: "Home", path: "/" },
                  { name: "About", path: "/about-us" },
                  { name: "Our Menu", path: "/menu" },
                  { name: "Reviews", path: "/reviews" },
                  { name: "Blogs", path: "/blogs" },
                 
                ].map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                       className={({ isActive }) => `nav-link block px-2 py-2 text-base font-medium capitalize transition-all duration-200 ${
                        isActive
                          ? "text-primary-400 active"
                          : "text-white hover:text-primary-400"
                      }`}
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <div className="absolute bottom-8 left-0 right-0 px-6">
                <NavLink
                  to="/reservation"
                  onClick={() => setMenuOpen(false)}
                  className="reservation-btn w-full px-6 py-3 rounded-full text-white font-medium flex items-center justify-center space-x-2"
                >
                  <span>Reservation</span>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </NavLink>
              </div>
            </div>
          </>
        )}
      </header>


    </div>
  );
}

export default NavBar;