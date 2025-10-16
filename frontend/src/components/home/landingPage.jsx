import React from "react";
import { ArrowRight, Coffee, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import banner1 from "../../assets/coffe/coffee_slide-1-1.jpg";

export default function HeroSection() {
  return (
    <div className="w-ful  relative overflow-hidden bg-white h-[700px]">
      {/* Subtle Coffee Bean Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 rounded-full border-2 border-#6F4E37-900"></div>
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full border-2 border-#6F4E37-900"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 rounded-full border-2 border-#6F4E37-900"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 rounded-full border-2 border-#6F4E37-900"></div>
      </div>

      {/* Floating Coffee Steam Effect */}
      <div className="absolute top-20 left-1/4 w-1 h-32 bg-gradient-to-t from-transparent via-gray-300 to-transparent opacity-30 animate-steam"></div>
      <div className="absolute top-32 right-2/3 w-1 h-40 bg-gradient-to-t from-transparent via-gray-300 to-transparent opacity-20 animate-steam" style={{ animationDelay: "1s" }}></div>

      <div className="flex items-center justify-center min-h-screen px-4 md:px-8 py-36">
        <div className="w-full max-w-8xl px-4  grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Section - Content */}
          <div className="flex flex-col justify-center space-y-6 relative order-2 md:order-1">
            {/* Decorative Coffee Bean Accent */}
            <div className="absolute -left-4 top-0 w-2 h-24 bg-gradient-to-b from-[#6F4E37] to-[#6F4E37] opacity-60 animate-slideDown"></div>

            <div className="space-y-5 relative">
              {/* Icon Badge */}
              <div className="inline-flex items-center gap-3 animate-fadeIn">
                <div className="p-2.5 bg-gradient-to-br from-[#6F4E37] to-[#6F4E37] rounded-lg shadow-lg">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <h5 className="text-#6F4E37-800 tracking-wider font-semibold text-sm md:text-base uppercase">
                  Premium Coffee Experience
                </h5>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-slideInLeft">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6F4E37] to-[#6F4E37] ">
                  Jambokawa
                </span>
              </h1>

              {/* Description */}
              <p className="text-gray-700 text-base md:text-lg leading-relaxed max-w-md animate-slideInRight">
                Experience the finest artisanal coffee in Kigali. Every cup tells a story of passion, 
                quality, and tradition. From bean to cup, we craft moments of pure <span className="font-semibold" style={{ color: '#6F4E37' }}>coffee perfection</span>.
              </p>

              {/* Coffee Features */}
              <div className="flex flex-wrap gap-6 pt-2 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6F4E37' }}></div>
                  <span className="text-gray-600 text-sm">Freshly Roasted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6F4E37' }}></div>
                  <span className="text-gray-600 text-sm">Locally Sourced</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6F4E37' }}></div>
                  <span className="text-gray-600 text-sm">Expert Baristas</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2 animate-slideInUp" style={{ animationDelay: "0.6s" }}>
              <Link to="/services">
                <button 
                  className="relative inline-flex items-center gap-2 text-white font-semibold py-3.5 px-7 rounded-lg group overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: 'linear-gradient(135deg, #6F4E37, #a89968)' }}
                >
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                  <span className="relative">Explore Services</span>
                  <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              
              <Link to="/menu">
                <button className="inline-flex items-center gap-2 bg-white border-2 font-semibold py-3.5 px-7 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg" style={{ borderColor: '#6F4E37', color: '#6F4E37' }}>
                  <Heart className="w-5 h-5" />
                  <span>View Menu</span>
                </button>
              </Link>
            </div>

            {/* Decorative Quote */}
            <div className="pt-0 animate-fadeIn " style={{ animationDelay: "0.8s" }}>
              <div className="flex items-start gap-3 pl-4 border-l-2" style={{ borderColor: '#6F4E37' }}>
                <Coffee className="w-5 h-5 mt-1 opacity-60" style={{ color: '#6F4E37' }} />
                <p className="text-gray-600 italic text-sm">
                  "Life begins after coffee. Start your day the Jambokawa way."
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="flex items-center justify-center h-full relative order-1 md:order-2">
            {/* Decorative Frame Elements */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 rounded-tl-3xl animate-drawBorder" style={{ borderColor: '#6F4E37' }}></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 rounded-br-3xl animate-drawBorder" style={{ borderColor: '#6F4E37', animationDelay: '0.3s' }}></div>
            
            {/* Floating Coffee Beans */}
            <div className="absolute top-10 right-10 w-3 h-3 rounded-full animate-float" style={{ backgroundColor: '#6F4E37' }}></div>
            <div className="absolute bottom-20 left-10 w-2 h-2 rounded-full animate-float" style={{ backgroundColor: '#6F4E37', animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 right-20 w-2.5 h-2.5 rounded-full animate-float" style={{ backgroundColor: '#6F4E37', animationDelay: '1.5s' }}></div>

            <div className="relative px-6 md:px-0">
              <img
                src={banner1}
                alt="Jambokawa Coffee Shop"
                className="w-full h-96 md:h-96 lg:h-[70vh] object-cover rounded-2xl shadow-2xl animate-scaleIn relative z-10"
              />
              {/* Soft Shadow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-20 blur-2xl" style={{ background: 'linear-gradient(135deg, #6F4E37, #a89968)' }}></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Animations */
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideDown {
          from { opacity: 0; height: 0; }
          to { opacity: 0.6; height: 6rem; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        @keyframes steam {
          0% { opacity: 0.1; transform: translateY(0) scaleY(1); }
          50% { opacity: 0.3; }
          100% { opacity: 0; transform: translateY(-100px) scaleY(1.5); }
        }

        @keyframes drawBorder {
          from { opacity: 0; width: 0; height: 0; }
          to { opacity: 1; width: 6rem; height: 6rem; }
        }

        .animate-slideInLeft { animation: slideInLeft 0.8s ease-out forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease-out forwards 0.2s; }
        .animate-slideInUp { animation: slideInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 1s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 1s ease-out forwards 0.3s; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-steam { animation: steam 4s ease-in-out infinite; }
        .animate-drawBorder { animation: drawBorder 1s ease-out forwards; }
      `}</style>
    </div>
  );
}