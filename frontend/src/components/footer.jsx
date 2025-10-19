import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Clock, Send, ArrowUp } from 'lucide-react';

export default function AbyRestaurantFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-20 animate-float">
        <div className="w-full h-full bg-primary-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-20 w-16 h-16 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-full h-full bg-secondary-500 rounded-full"></div>
      </div>
      <div className="absolute top-1/2 right-10 w-24 h-24 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-full h-full bg-green-500 rounded-full transform rotate-45"></div>
      </div>

      {/* Pizza Slice Decoration */}
      <div className="absolute top-8 left-8 w-32 h-32 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop"
          alt="Pizza"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Tomato Decoration */}
      <div className="absolute top-8 right-12 w-24 h-24 opacity-40">
        <div className="w-full h-full bg-primary-500 rounded-full"></div>
      </div>

      {/* Stars/Dots Background */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      {/* Top Section */}
      <section className="relative z-10 py-12 px-6 md:px-16">
        <div className=" mx-auto">
          {/* CTA Banner */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-secondary-600/20 to-primary-600/20 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-secondary-500/20">
            <div className="flex items-center gap-6 mb-6 md:mb-0">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">
                  Feel Hunger! Order Your <span className="text-primary-500">Like Food.</span>
                </h3>
              </div>
            </div>
            <button className="bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap">
              Order Now
            </button>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">A</span>
                </div>
                <h2 className="text-3xl font-bold">Aby Restaurant</h2>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Experience culinary excellence with fresh ingsecondaryients and authentic flavors. We serve passion on every plate.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-600 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-600 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-600 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="mailto:info@abyrestaurant.com"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-secondary-600 to-primary-600 text-white hover:scale-110 hover:shadow-lg transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-primary-500">Address</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-1" />
                  <p className="text-gray-400">
                    570 8th Ave, New York, NY 10018 United States
                  </p>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  View Google Map →
                </a>
              </div>
            </div>

            {/* Book A Table & Hours */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-primary-500">Book A Table</h3>
              <div className="space-y-4 mb-6">
                <p className="text-gray-400">
                  Reserve your table for an unforgettable dining experience.
                </p>
                <a 
                  href="tel:123-59794069"
                  className="text-primary-500 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Make A Call
                </a>
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-primary-500">Opening Hours</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>Monday-Friday: 8am - 4pm</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4 text-primary-500" />
                  <span>Saturday: 9am - 5pm</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-xl font-bold mb-6 text-primary-500">Newsletter</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to get special offers and updates.
              </p>
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button className="bg-gradient-to-r from-secondary-600 to-secondary-500 hover:from-secondary-500 hover:to-secondary-600 p-3 rounded-lg transition-all duration-300 hover:scale-105">
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
              <button className="text-primary-500 hover:text-primary-400 transition-colors text-sm">
                Subscribe Now →
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              Copyright © {new Date().getFullYear()} <span className="text-primary-500">Aby Restaurant</span> - All Rights Reserved
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-secondary-600 to-primary-600 p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-primary-500/50 transition-all duration-300 z-50 group"
        aria-label="Scroll to Top"
      >
        <ArrowUp className="text-white text-xl group-hover:translate-y-[-2px] transition-transform" />
      </button>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
}