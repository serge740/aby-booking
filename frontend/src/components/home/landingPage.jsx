import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Truck, Coffee, Croissant, Beef, Store, Utensils } from 'lucide-react';

export default function GroceryHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [
    {
      title: 'Order Food from Top Restaurants',
      subtitle: 'You can order food from your preferred restaurant, café, bakery, or supermarket — delivered fresh in minutes.',
      tag: '50% Off First Order',
      tagColor: 'orange',
      icon: Utensils,
      gradient: 'from-orange-500 to-red-600',
      productImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070',
      productName: 'Margherita Pizza',
      productRating: '4.8',
      floatingProduct: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=2070',
      floatingName: 'Pasta Carbonara',
      floatingRating: '4.9',
      mainImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2074',
    },
    {
      title: 'Fresh Coffee & Pastries Daily',
      subtitle: 'Start your day with artisanal coffee and freshly baked croissants from local cafés and bakeries.',
      tag: 'Free Delivery on Coffee',
      tagColor: 'orange',
      icon: Coffee,
      gradient: 'from-orange-500 to-red-600',
      productImage: 'https://images.unsplash.com/photo-1495474472287-4d71bc168240?q=80&w=2070',
      productName: 'Cappuccino',
      productRating: '4.7',
      floatingProduct: 'https://images.unsplash.com/photo-1550259979-a1c8e070c7bc?q=80&w=2070',
      floatingName: 'Butter Croissant',
      floatingRating: '4.9',
      mainImage: 'https://images.unsplash.com/photo-1498804108-7d28b79d4a2b?q=80&w=2074',
    },
    {
      title: 'Premium Butchery & Meats',
      subtitle: 'Hand-cut premium meats, marinated cuts, and gourmet sausages from trusted local butcheries.',
      tag: 'BBQ Specials',
      tagColor: 'orange',
      icon: Beef,
      gradient: 'from-orange-500 to-red-600',
      productImage: 'https://images.unsplash.com/photo-1607623816116-7e2b19c6b5b4?q=80&w=2070',
      productName: 'Ribeye Steak',
      productRating: '4.9',
      floatingProduct: 'https://images.unsplash.com/photo-1627308595228-f9f0a50ee1c3?q=80&w=2070',
      floatingName: 'Lamb Chops',
      floatingRating: '4.8',
      mainImage: 'https://images.unsplash.com/photo-1603360948881-66a7e0d5e3b5?q=80&w=2074',
    },
    {
      title: 'Bakery Fresh Every Morning',
      subtitle: 'Sourdough, baguettes, cakes, and pastries — baked fresh and delivered warm to your door.',
      tag: 'Artisan Bread',
      tagColor: 'orange',
      icon: Croissant,
      gradient: 'from-orange-500 to-red-600',
      productImage: 'https://images.unsplash.com/photo-1509440156595-820a6a5a0af8?q=80&w=2070',
      productName: 'Sourdough Loaf',
      productRating: '4.8',
      floatingProduct: 'https://images.unsplash.com/photo-1576613152-6e0d0ac88a8a?q=80&w=2070',
      floatingName: 'Chocolate Éclair',
      floatingRating: '4.9',
      mainImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad2d3136?q=80&w=2074',
    },
    {
      title: 'Supermarket Essentials',
      subtitle: 'Groceries, dairy, snacks, and household items — everything you need from your favorite supermarket.',
      tag: 'Daily Deals',
      tagColor: 'orange',
      icon: Store,
      gradient: 'from-orange-500 to-red-600',
      productImage: 'https://images.unsplash.com/photo-1588964896361-c0a0741c63d1?q=80&w=2070',
      productName: 'Organic Milk',
      productRating: '4.6',
      floatingProduct: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2070',
      floatingName: 'Fresh Eggs',
      floatingRating: '4.7',
      mainImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2074',
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const Icon = slides[currentSlide].icon;

  return (
    <div className="relative w-full h-screen md:h-[520px] overflow-hidden">
      
      {/* Full Screen Background Image */}
      <div 
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{
          backgroundImage: `url(${slides[currentSlide].mainImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} key={currentSlide}>
              
              {/* Discount Tag */}
              <div className={`inline-flex items-center gap-2 bg-${slides[currentSlide].tagColor}-500 text-white px-4 py-2 rounded-full shadow-lg`}>
                <span className="text-sm font-bold tracking-wide">
                  {slides[currentSlide].tag}
                </span>
              </div>
              
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight drop-shadow-2xl">
                  {slides[currentSlide].title}
                </h1>
                
                <p className="text-lg lg:text-xl text-white/90 max-w-xl leading-relaxed drop-shadow-lg">
                  {slides[currentSlide].subtitle}
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <button className={`group px-8 py-4 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-full text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-lg`}>
                  Order Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2 pt-6">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? `w-12 bg-gradient-to-r ${slides[currentSlide].gradient}` 
                        : 'w-8 bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Content - Floating Cards */}
            <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              
              <div className="relative w-full max-w-xl mx-auto aspect-[4/3]">
                {/* Floating Product Card - Top Left */}
                <div className="absolute top-6 left-4 bg-white rounded-2xl shadow-2xl p-3 animate-float z-20" style={{animationDelay: '0s'}}>
                  <img 
                    src={slides[currentSlide].productImage}
                    alt={slides[currentSlide].productName}
                    className="w-16 h-16 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-bold text-gray-900 truncate w-20">{slides[currentSlide].productName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{slides[currentSlide].productRating}</span>
                  </div>
                </div>

                {/* Floating Product Card - Bottom Right */}
                <div className="absolute bottom-6 right-4 bg-white rounded-2xl shadow-2xl p-3 animate-float z-20" style={{animationDelay: '0.8s'}}>
                  <img 
                    src={slides[currentSlide].floatingProduct}
                    alt={slides[currentSlide].floatingName}
                    className="w-16 h-16 object-cover rounded-lg mb-2"
                  />
                  <p className="text-sm font-bold text-gray-900 truncate w-20">{slides[currentSlide].floatingName}</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-600">{slides[currentSlide].floatingRating}</span>
                  </div>
                </div>

                {/* Delivery Badge */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl px-5 py-2 flex items-center gap-2 animate-bounce-slow z-20">
                  <div className={`w-7 h-7 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-full flex items-center justify-center`}>
                    <Truck className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">Fast Delivery!</span>
                </div>

                {/* Decorative Glowing Circles */}
                <div className={`absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-full opacity-20 blur-3xl animate-pulse`}></div>
                <div className={`absolute bottom-1/3 left-1/4 w-40 h-40 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-full opacity-15 blur-3xl animate-pulse`} style={{animationDelay: '1s'}}></div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -8px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}