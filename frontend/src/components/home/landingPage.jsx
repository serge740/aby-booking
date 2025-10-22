import React, { useState, useEffect } from 'react';

export default function AbyRestaurantHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1920&h=1080&fit=crop',
      title: 'Aby Booking',
      subtitle: 'Where every bite is a celebration of flavor.'
    },
    {
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1920&h=1080&fit=crop',
      title: 'Aby Booking',
      subtitle: 'Authentic cuisine crafted with passion.'
    },
    {
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&h=1080&fit=crop',
      title: 'Aby Booking',
      subtitle: 'Experience culinary excellence.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              zIndex: index === currentSlide ? 1 : 0
            }}
          >
            {/* Background Image with Ken Burns effect */}
            <div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url(${slide.image})`,
                scale: index === currentSlide ? 1.25 : 1,
                animation: index === currentSlide ? 'kenBurns 6000ms ease-out' : 'none'
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
              <p className="text-white/90 text-sm md:text-base mb-2 font-light tracking-wider uppercase">
                Welcome to
              </p>
              <h1 className="text-white text-6xl md:text-8xl font-bold mb-4 tracking-tight">
                {slide.title}
              </h1>
              <p className="text-white/90 text-xl md:text-2xl mb-12 font-light max-w-2xl">
                {slide.subtitle}
              </p>
              
              {/* Promotion Badge */}
              <div className="mb-8 inline-flex items-center gap-0 animate-pulse">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 rounded-l-lg">
                  <p className="text-white text-base md:text-lg font-medium">Buy One. Get One</p>
                </div>
                <div className="bg-gradient-to-r from-secondary-600 to-primary-600 px-6 py-3 rounded-r-lg relative">
                  <p className="text-white text-xl md:text-2xl font-bold">FREE</p>
                  <div className="absolute right-0 top-0 bottom-0 w-0 h-0 border-t-[24px] border-t-transparent border-b-[24px] border-b-transparent border-l-[16px] border-l-primary-600 translate-x-full md:border-t-[28px] md:border-b-[28px] md:border-l-[20px]"></div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 flex-wrap justify-center">
                <button 
                  onClick={() => window.location.href = '#our-story'}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium text-sm md:text-base"
                >
                  Our Story
                </button>
                <button 
                  onClick={() => window.location.href = '#our-menu'}
                  className="px-8 py-3 bg-gradient-to-r from-secondary-600 to-primary-600 text-white rounded-full hover:from-secondary-500 hover:to-primary-500 transition-all duration-300 font-medium text-sm md:text-base shadow-lg"
                >
                  Check Menu
                </button>
              </div>

              {/* Contact Info */}
              <div className="mt-12 flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white/70 text-xs">Delivery Order</p>
                  <p className="text-secondary-400 text-base md:text-lg font-bold">123-59794069</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-secondary-500 w-8'
                : 'bg-white/50 hover:bg-white/75 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes kenBurns {
          0% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(0.8);
          }
        }
      `}</style>
    </div>
  );
}