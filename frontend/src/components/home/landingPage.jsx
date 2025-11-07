import React, { useState, useEffect } from 'react';
import { Star, Coffee, UtensilsCrossed, Hotel, ShoppingBag, Pizza, IceCream, ArrowRight } from 'lucide-react';
import Image1 from '../../assets/banners/banner-img1.png'

export default function AbyBookingHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [
    {
      title: 'Restaurant Ordering',
      subtitle: 'Transform your dining experience',
      description:
        'Reimagine in-restaurant dining with seamless digital ordering that connects tables to the kitchen in real time. Enable guests to browse interactive menus, customize dishes, and receive live status updates — all while enhancing staff efficiency and reducing wait times. Personalized recommendations help diners discover new favorites and elevate every meal.',
      icon: UtensilsCrossed,
      color: 'orange',
      gradient: 'from-orange-500 to-red-600',
      background:Image1,
    },
    {
      title: 'Coffee Shop Management',
      subtitle: 'Perfect every cup',
      description:
        'Streamline your café operations from bean to cup. Manage complex orders, handle modifiers, and track barista performance effortlessly. With real-time updates and integrated inventory tools, ensure consistency and speed in every espresso, cappuccino, or latte — delivering that perfect brew, every time.',
      icon: Coffee,
      color: 'amber',
      gradient: 'from-amber-500 to-orange-600',
      background: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2074'
    },
    {
      title: 'Hotel Services',
      subtitle: 'Luxury at your fingertips',
      description:
        'Elevate the guest experience with an all-in-one digital concierge. From room service and dining reservations to spa bookings and housekeeping requests, every service is just a tap away. Delight guests with personalized offers, instant confirmations, and a frictionless interface that reflects your brands elegance and hospitality.',
      icon: Hotel,
      color: 'blue',
      gradient: 'from-blue-500 to-purple-600',
      background: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070'
    },
    {
      title: 'Fast Food Orders',
      subtitle: 'Speed meets convenience',
      description:
        'Boost throughput and customer satisfaction with an optimized fast-food ordering system. Handle large order volumes with ease through smart queue management, automated notifications, and real-time kitchen coordination. Designed for peak-hour performance — where every second counts and every order matters.',
      icon: Pizza,
      color: 'red',
      gradient: 'from-red-500 to-pink-600',
      background: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070'
    },
    {
      title: 'Bakery & Desserts',
      subtitle: 'Sweet moments delivered',
      description:
        'Bring your bakery to life with a digital ordering system built for freshness and creativity. Showcase your pastries, breads, and custom cakes with rich visuals and easy pre-order scheduling. Customers can personalize their treats, track pickup times, and enjoy the sweetest convenience possible.',
      icon: IceCream,
      color: 'pink',
      gradient: 'from-pink-500 to-rose-600',
      background: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072'
    },
    {
      title: 'Food Court Hub',
      subtitle: 'One platform, endless choices',
      description:
        'Unite multiple food vendors under one digital ecosystem. Customers can browse menus, mix and match from different stalls, and complete split or group payments effortlessly. Streamlined operations, centralized analytics, and an intuitive ordering flow make food courts smarter and more enjoyable than ever.',
      icon: ShoppingBag,
      color: 'purple',
      gradient: 'from-purple-500 to-indigo-600',
      background: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2074'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const Icon = slides[currentSlide].icon;

  return (
 <div className="relative  inset-0 h-screen overflow-hidden bg-gradient-to-br from-black/100 via-zinc-800/100 to-black/100 md:pt-10">
      
      {/* Background Image Overlay with Transitions */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.background}
              alt={`${slide.title} background`}
              className="w-full h-full object-cover opacity-20"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-br from-black/100 via-zinc-800/100 to-black/100 "></div> */}
          </div>
        ))}
      </div>

      {/* Main Content - Left Aligned */}
      <div className="relative z-10 flex items-center min-h-screen">
        <div className="container mx-auto px-6 lg:px-12 max-w-8xl">
          
          {/* Content Section */}
          <div className={`space-y-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            
            {/* Brand Logo */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 px-3 py-1.5 rounded-full mb-4">
                <Star className="w-3 h-3 text-orange-400 fill-orange-400 animate-pulse" />
                <span className="text-orange-300 text-xs font-medium tracking-wide">Next-Gen Ordering</span>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-gradient">
                  Aby Booking
                </span>
              </h1>
              <p className="text-gray-400 text-base lg:text-lg">Smart Order Management System</p>
            </div>

            {/* Dynamic Category Carousel */}
            <div className="space-y-4 transition-all duration-700" key={currentSlide}>
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 bg-gradient-to-br ${slides[currentSlide].gradient} rounded-2xl flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-2xl shadow-orange-500/50`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    {slides[currentSlide].title}
                  </h2>
                  <p className="text-orange-400 text-base font-medium mt-1">
                    {slides[currentSlide].subtitle}
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 text-sm lg:text-base max-w-2xl" style={{lineHeight: 2}}>
                {slides[currentSlide].description}
              </p>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide 
                      ? 'w-12 bg-gradient-to-r from-orange-500 to-red-600' 
                      : 'w-8 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="group px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-semibold text-sm hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                Start Ordering
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold text-sm hover:bg-white/20 hover:scale-105 transition-all duration-300">
                Watch Demo
              </button>
            </div>

          </div>
          
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
};
