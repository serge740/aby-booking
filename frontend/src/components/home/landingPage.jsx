import React, { useState, useEffect } from 'react';
import { Star, Coffee, UtensilsCrossed, Hotel, ShoppingBag, Pizza, IceCream, ArrowRight, Check, Zap, Shield, Sparkles } from 'lucide-react';

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
    gradient: 'from-orange-500 to-red-600'
  },
  {
    title: 'Coffee Shop Management',
    subtitle: 'Perfect every cup',
    description:
      'Streamline your café operations from bean to cup. Manage complex orders, handle modifiers, and track barista performance effortlessly. With real-time updates and integrated inventory tools, ensure consistency and speed in every espresso, cappuccino, or latte — delivering that perfect brew, every time.',
    icon: Coffee,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    title: 'Hotel Services',
    subtitle: 'Luxury at your fingertips',
    description:
      'Elevate the guest experience with an all-in-one digital concierge. From room service and dining reservations to spa bookings and housekeeping requests, every service is just a tap away. Delight guests with personalized offers, instant confirmations, and a frictionless interface that reflects your brand’s elegance and hospitality.',
    icon: Hotel,
    color: 'blue',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    title: 'Fast Food Orders',
    subtitle: 'Speed meets convenience',
    description:
      'Boost throughput and customer satisfaction with an optimized fast-food ordering system. Handle large order volumes with ease through smart queue management, automated notifications, and real-time kitchen coordination. Designed for peak-hour performance — where every second counts and every order matters.',
    icon: Pizza,
    color: 'red',
    gradient: 'from-red-500 to-pink-600'
  },
  {
    title: 'Bakery & Desserts',
    subtitle: 'Sweet moments delivered',
    description:
      'Bring your bakery to life with a digital ordering system built for freshness and creativity. Showcase your pastries, breads, and custom cakes with rich visuals and easy pre-order scheduling. Customers can personalize their treats, track pickup times, and enjoy the sweetest convenience possible.',
    icon: IceCream,
    color: 'pink',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    title: 'Food Court Hub',
    subtitle: 'One platform, endless choices',
    description:
      'Unite multiple food vendors under one digital ecosystem. Customers can browse menus, mix and match from different stalls, and complete split or group payments effortlessly. Streamlined operations, centralized analytics, and an intuitive ordering flow make food courts smarter and more enjoyable than ever.',
    icon: ShoppingBag,
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600'
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
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">
  

 
      {/* Main Content Grid */}
      <div className="relative z-10  flex items-center">
        <div className="px-10 w-[100%]  min-h-screen mt-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Section - Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              
              {/* Brand Logo */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-md border border-orange-400/30 px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-orange-400 fill-orange-400 animate-pulse" />
                  <span className="text-orange-300 text-sm font-medium tracking-wide">Next-Gen Ordering</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-gradient">
                    Aby Booking
                  </span>
                </h1>
                <p className="text-gray-400 text-xl">Smart Order Management System</p>
              </div>

              {/* Dynamic Category */}
              <div className="space-y-4 transition-all duration-700" key={currentSlide}>
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${slides[currentSlide].gradient} rounded-2xl flex items-center justify-center transform hover:scale-110 hover:rotate-6 transition-all duration-300 shadow-2xl shadow-orange-500/50 animate-bounce-slow`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-white">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-orange-400 text-lg font-medium mt-1">
                      {slides[currentSlide].subtitle}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed ">
                  {slides[currentSlide].description}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 ">
                <button className="group px-8 py-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-2">
                  Start Ordering
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300">
                  Watch Demo
                </button>
              </div>

            </div>

            {/* Right Section - Animated Visual */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative w-full h-[600px]">
                
                {/* Main Display Card */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full max-w-md">
                    
                    {/* Floating Phone Mockup */}
                    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-3 shadow-2xl border border-white/10 animate-float-slow">
                      <div className="bg-black rounded-[2.5rem] overflow-hidden">
                        
                        {/* Phone Screen Content */}
                        <div className="relative h-[550px] bg-gradient-to-br from-gray-900 via-gray-800 to-black">
                          
                          {/* Dynamic Content based on slide */}
                          <div className="p-6 space-y-4" key={currentSlide}>
                            
                            {/* Header */}
                            <div className="flex items-center justify-between animate-fade-in">
                              <div>
                                <p className="text-gray-400 text-sm">Welcome to</p>
                                <h3 className="text-white text-xl font-bold">{slides[currentSlide].title}</h3>
                              </div>
                              <div className={`w-12 h-12 bg-gradient-to-br ${slides[currentSlide].gradient} rounded-xl flex items-center justify-center animate-pulse`}>
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                            </div>

                            {/* Featured Item Card */}
                            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-4 space-y-3 animate-slide-up">
                              <div className="w-full h-28 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center">
                                <Icon className="w-16 h-16 text-orange-400" />
                              </div>
                              <div>
                                <h4 className="text-white font-semibold">Featured Special</h4>
                                <p className="text-gray-400 text-sm">Today's recommended selection</p>
                              </div>
                             
                            </div>

                         

                            {/* Live Orders Animation */}
                            <div className="space-y-2">
                              <p className="text-gray-400 text-xs uppercase tracking-wide">Live Orders</p>
                              {[1, 2, 3].map((_, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2 animate-pulse"
                                  style={{ animationDelay: `${idx * 200}ms` }}
                                >
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                                  <div className="flex-1">
                                    <div className="h-2 bg-white/20 rounded w-3/4 mb-1"></div>
                                    {/* <div className="h-2 bg-white/10 rounded w-1/2"></div> */}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes drift {
          0% { transform: translate(0, 0); }
          100% { transform: translate(-40px, -40px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}