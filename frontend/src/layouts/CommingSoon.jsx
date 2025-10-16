import React, { useState, useEffect } from 'react';
import { Coffee, Mail, Clock } from 'lucide-react';
import Image from '../assets/image.jpg'

function CommingSoon() {
  const [steam, setSteam] = useState([]);

  useEffect(() => {
    const steamParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 2
    }));
    setSteam(steamParticles);
  }, []);

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
       backgroundImage: `url(${Image})`
        }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-100px) scale(1.5); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="max-w-4xl w-full relative z-10" style={{ animation: 'fadeIn 1s ease-out' }}>
        {/* Main Content */}
        <div className="text-center relative">
          {/* Steam effect */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32">
            {steam.map(particle => (
              <div
                key={particle.id}
                className="absolute bottom-0 w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${particle.left}%`,
                  animation: `steam ${particle.duration}s ease-out infinite`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>

          {/* Coffee Icon */}
          <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-[#c0aa83] to-[#c0aa83] rounded-full mb-6 shadow-2xl" style={{ animation: 'pulse 2s ease-in-out infinite' }}>
            <Coffee className="w-8 h-8 text-white" />
          </div>

          {/* Brand Name */}
          <h1 className="text-6xl md:text-8xl font-bold mb-4 text-white drop-shadow-2xl">
            JamboKawa
          </h1>

          {/* Tagline */}
          <p className="text-2xl md:text-3xl text-amber-100 mb-8 font-medium drop-shadow-lg">
            Your Perfect Coffee Experience
          </p>

          {/* Coming Soon Badge */}
          <div className="inline-block bg-gradient-to-r from-[#c0aa83] to-[#c0aa83 text-white px-8 py-3 rounded-full text-lg font-semibold mb-8 shadow-2xl">
            <Clock className="inline-block w-5 h-5 mr-2 -mt-1" />
            Opening Soon
          </div>

          {/* Description */}
          <p className="text-white text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            We're brewing something special! Get ready to experience the finest coffee, 
            cozy ambiance, and warm hospitality. JamboKawa is coming to transform your coffee moments.
          </p>

          {/* Contact Information */}
          <div className="space-y-6 max-w-md mx-auto">
            {/* Email */}
            <a 
              href="mailto:info@coffeekawa.com"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-md hover:bg-white/30 p-4 rounded-xl transition-all duration-300 border border-white/30 group"
            >
              <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">info@JamboKawa.com</span>
            </a>

            {/* Owner Contact */}
            <a 
              href="mailto:mwizerwab@gmail.com"
              className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-md hover:bg-white/30 p-4 rounded-xl transition-all duration-300 border border-white/30 group"
            >
              <Mail className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">mwizerwab@gmail.com</span>
            </a>
          </div>

        
        </div>

    
      </div>
    </div>
  );
}

export default CommingSoon;