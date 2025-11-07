import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Clock, Send, ArrowUp, Globe, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';

export default function AbyRestaurantFooter() {
  const { t, i18n } = useTranslation();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

    const [langOpen, setLangOpen] = useState(false);

    const languages = [
    { code: 'en', name: 'English', flag: 'GB' },
    { code: 'fr', name: 'Français', flag: 'FR' },
    { code: 'rw', name: 'Kinyarwanda', flag: 'RW' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  const quickLinks = [
    { label: 'Home', path: "/" },
    { label: 'About Us', path: "/about" },
    { label: 'Menu', path: "/menu" },
    { label: 'Reservations', path: "/reservations" },
    { label: 'Gallery', path: "/gallery" },
    { label: 'Contact', path: "/contact" }
  ];

  const services = [
    { label: 'Dine In', path: '/dine-in' },
    { label: 'Takeaway', path: '/takeaway' },
    { label: 'Delivery', path: '/delivery' },
    { label: 'Catering', path: '/catering' },
    { label: 'Private Events', path: '/events' },
    { label: 'Gift Cards', path: '/gift-cards' }
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', name: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', name: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', name: 'Instagram' },
    { icon: Mail, href: 'mailto:info@abyrestaurant.com', name: 'Email' }
  ];

  return (
    <footer className="relative bg-gray-900 text-white w-full overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/100 via-zinc-800/100 to-black/100 z-[10]">
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 opacity-10 animate-float">
        <div className="w-full h-full bg-red-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-20 right-20 w-16 h-16 opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-full h-full bg-orange-500 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full mx-auto px-6 sm:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Company Info - Takes more space */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <h2 className="text-3xl font-bold">Aby Booking</h2>
            </div>
              
            <p className="text-gray-300 mb-8 leading-relaxed max-w-md">
              Experience culinary excellence with fresh ingredients and authentic flavors. We serve passion on every plate, creating unforgettable dining moments.
            </p>
              
            {/* Newsletter */}
            <div className="max-w-md">
              <p className="text-gray-400 mb-4 text-sm">
                Subscribe to get special offers and updates.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
                />
                <button className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-600 px-4 py-3 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Quicklinks */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-2 mb-6">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <h3 className="text-lg font-semibold">Quicklinks</h3>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="text-red-400 group-hover:translate-x-1 transition-transform">↗</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Services */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-2 mb-6">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <h3 className="text-lg font-semibold">Our Services</h3>
            </div>
            <ul className="space-y-3">
              {services.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.path}
                    className="text-gray-300 hover:text-red-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="text-red-400 group-hover:translate-x-1 transition-transform">↗</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <div className="flex items-start gap-2 mb-6">
              <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
              <h3 className="text-lg font-semibold">Contact Info</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-orange-400 text-sm mb-2">Reservations</p>
                <a href="tel:123-59794069" className="text-white text-lg font-semibold hover:text-red-400 transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  123-59794069
                </a>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <p className="text-orange-400 text-sm mb-2">Email</p>
                <a href="mailto:info@abyrestaurant.com" className="text-white hover:text-red-400 transition-colors">
                  info@abyrestaurant.com
                </a>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <p className="text-orange-400 text-sm mb-2">Location</p>
                <p className="text-white flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-1" />
                  <span>570 8th Ave, New York, NY 10018 United States</span>
                </p>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <p className="text-orange-400 text-sm mb-2">Opening Hours</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span>Mon-Fri: 8am - 4pm</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span>Saturday: 9am - 5pm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-800">
        <div className="w-full mx-auto px-6 sm:px-8 lg:px-16 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © Copyright {new Date().getFullYear()}. All rights reserved. <span className="text-red-400">Aby Restaurant</span>
            </p>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-red-600 hover:to-orange-600 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={18} />
                </a>
              ))}

               <div className="relative">
                <button onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-sm">
                  <Globe className="w-4 h-4 text-primary-400" />
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden shadow-xl min-w-[180px]">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left text-sm ${i18n.language === lang.code ? 'bg-white/10 text-primary-400' : 'text-gray-400'}`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-orange-600 to-red-600 p-4 rounded-full shadow-2xl hover:scale-110 hover:shadow-red-500/50 transition-all duration-300 z-50 group"
        aria-label="Scroll to Top"
      >
        <ArrowUp className="text-white group-hover:translate-y-[-2px] transition-transform" size={20} />
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