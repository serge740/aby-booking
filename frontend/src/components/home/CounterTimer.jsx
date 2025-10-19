import React, { useState, useEffect } from 'react';

export default function AbyComingSoon() {
  const [timeLeft, setTimeLeft] = useState({
    days: 15,
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        seconds--;
        
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        
        if (hours < 0) {
          hours = 23;
          days--;
        }
        
        if (days < 0) {
          days = 0;
          hours = 0;
          minutes = 0;
          seconds = 0;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex items-center">
      {/* Animated Background Stars/Dots */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Floating Ingredients */}
      <div className="absolute top-20 left-16 animate-float">
        <div className="w-16 h-16 bg-green-500 rounded-full opacity-80 transform rotate-45"></div>
      </div>

      <div className="absolute top-32 right-32 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-12 h-12 bg-pink-300 rounded-full opacity-70"></div>
      </div>

      <div className="absolute bottom-24 left-24 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-20 h-24 bg-green-600 rounded-full opacity-60 transform rotate-12"></div>
      </div>

      <div className="absolute bottom-32 right-16 animate-float" style={{ animationDelay: '0.5s' }}>
        <div className="w-14 h-14 bg-orange-500 rounded-full opacity-70"></div>
      </div>

      <div className="absolute top-1/2 left-32 animate-float" style={{ animationDelay: '1.5s' }}>
        <div className="w-12 h-12 bg-amber-100 rounded-full opacity-60"></div>
      </div>

      <div className="absolute bottom-1/3 right-48 animate-float" style={{ animationDelay: '2.5s' }}>
        <div className="w-10 h-10 bg-amber-200 rounded-full opacity-70"></div>
      </div>

      {/* Decorative Chef Hat Icon Top Right */}
      <div className="absolute top-12 right-12 opacity-20">
        <svg className="w-24 h-24 text-orange-500" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 20 L60 35 L75 35 L62 47 L68 62 L50 50 L32 62 L38 47 L25 35 L40 35 Z"/>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Pizza Image */}
          <div className="relative">
            <div className="relative w-full max-w-2xl mx-auto">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 to-red-500/30 blur-3xl rounded-full animate-pulse"></div>
              
              {/* Pizza */}
              <div className="relative aspect-square rounded-full overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop"
                  alt="Spicy Chicken Pizza"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-8">
            {/* Coming Soon Badge */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-1 bg-red-500"></div>
              <p className="text-red-500 text-lg md:text-xl font-medium italic">Coming Soon</p>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="text-white">SPICY CHICKEN</span>
              <br />
              <span className="text-white">PIZZA </span>
              <span className="text-orange-500">FOOD</span>
            </h1>

            {/* Subtitle */}
            <p className="text-white/80 text-lg md:text-xl">
              Feel Hunger! Order Your Favourite Food.
            </p>

            {/* Countdown Timer */}
            <div className="flex items-center gap-4 md:gap-8 flex-wrap">
              {/* Days */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 mb-2 border border-white/20">
                  <span className="text-white text-4xl md:text-5xl font-bold">
                    {formatNumber(timeLeft.days)}
                  </span>
                </div>
                <p className="text-white/70 text-sm md:text-base">Days</p>
              </div>

              <span className="text-red-500 text-3xl md:text-4xl font-bold">:</span>

              {/* Hours */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 mb-2 border border-white/20">
                  <span className="text-white text-4xl md:text-5xl font-bold">
                    {formatNumber(timeLeft.hours)}
                  </span>
                </div>
                <p className="text-white/70 text-sm md:text-base">Hour</p>
              </div>

              <span className="text-red-500 text-3xl md:text-4xl font-bold">:</span>

              {/* Minutes */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 mb-2 border border-white/20">
                  <span className="text-white text-4xl md:text-5xl font-bold">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                </div>
                <p className="text-white/70 text-sm md:text-base">Minutes</p>
              </div>

              <span className="text-red-500 text-3xl md:text-4xl font-bold">:</span>

              {/* Seconds */}
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 mb-2 border border-white/20">
                  <span className="text-white text-4xl md:text-5xl font-bold">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                </div>
                <p className="text-white/70 text-sm md:text-base">Seconds</p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-12 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(10deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}