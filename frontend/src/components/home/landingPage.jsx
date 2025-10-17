import React, { useState, useEffect } from 'react';

export default function CafeHeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920&h=1080&fit=crop',
      title: 'Cafe Klang',
      subtitle: 'your favourite coffee daily lives.'
    },
    {
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1920&h=1080&fit=crop',
      title: 'Cafe Klang',
      subtitle: 'Where every cup tells a story.'
    },
    {
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1920&h=1080&fit=crop',
      title: 'Cafe Klang',
      subtitle: 'Experience the perfect blend.'
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

                animation: index === currentSlide ? 'kenBurns 6000ms ease-out ' : 'none'
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
              <p className="text-white/90 text-sm md:text-base mb-2 font-light tracking-wider">
                Welcome to Barista.co
              </p>
              <h1 className="text-white text-5xl md:text-7xl font-bold mb-4">
                {slide.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-8 font-light">
                {slide.subtitle}
              </p>
              
              {/* Buttons */}
              <div className="flex gap-4 flex-wrap justify-center">
                <button 
                onClick={()=> window.location.href = '#our-story'}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300 font-medium">
                  Our Story
                </button>
                <button 
                onClick={()=> window.location.href = '#our-menu'}
                className="px-8 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-all duration-300 font-medium">
                  Check Menu
                </button>
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
                ? 'bg-white w-8'
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