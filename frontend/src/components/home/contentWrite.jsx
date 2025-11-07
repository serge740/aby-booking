import React, { useState } from 'react';
import { 
  Coffee, Truck, Users, Star, ShoppingCart, Handshake, 
  ArrowRight, Sparkles, Utensils, Hotel, Store, 
  Cake, Wine, Package 
} from 'lucide-react';

const services = [
  {
    title: 'Restaurant Ordering',
    icon: Utensils,
    description: 'Order delicious meals from top restaurants with real-time tracking and contactless delivery.',
    color: 'from-orange-500 to-red-500',
  },
  {
    title: 'Hotel Booking',
    icon: Hotel,
    description: 'Book luxury stays, budget hotels, or vacation rentals with instant confirmation and best rates.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Supermarket Shopping',
    icon: ShoppingCart,
    description: 'Shop groceries, fresh produce, and daily essentials with same-day delivery options.',
    color: 'from-red-500 to-pink-600',
  },
  {
    title: 'Coffee & Cafe',
    icon: Coffee,
    description: 'Freshly brewed premium coffee, lattes, and pastries from your favorite local cafes.',
    color: 'from-orange-600 to-amber-700',
  },
  {
    title: 'Bakery Delights',
    icon: Cake,
    description: 'Artisanal bread, cakes, croissants, and custom orders for every celebration.',
    color: 'from-yellow-500 to-orange-600',
  },
  {
    title: 'Bar & Drinks',
    icon: Wine,
    description: 'Craft cocktails, mocktails, wines, and bar snacks delivered chilled and ready.',
    color: 'from-red-600 to-rose-700',
  },
  {
    title: '24/7 Fast Delivery',
    icon: Truck,
    description: 'Lightning-fast delivery across all services — any time, day or night.',
    color: 'from-orange-400 to-red-500',
  },
  {
    title: 'Loyalty Rewards',
    icon: Star,
    description: 'Earn points on every order, redeem discounts, and unlock VIP perks.',
    color: 'from-amber-600 to-yellow-600',
  },
  {
    title: 'Become a Partner',
    icon: Handshake,
    description: 'Join our platform as a restaurant, hotel, or store and grow your business with us.',
    color: 'from-red-500 to-orange-600',
  },
];

export default function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section className="relative py-16 md:py-10 px-4 md:px-8 bg-gradient-to-b from-orange-50 via-red-50 to-amber-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-red-500/20 to-amber-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-8xl pl-2 pr-2 mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200">
            <Sparkles className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-bold tracking-wider text-orange-700">ALL-IN-ONE PLATFORM</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mt-6 mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent leading-tight">
            Your Everyday Needs,
            <br />
            <span className="text-red-700">Delivered Fast</span>
          </h2>
          
          <p className="text-gray-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mt-4">
            Food, stay, shop, sip, celebrate — one app for all your lifestyle needs.
          </p>
        </div>

        {/* 9 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onMouseMove={handleMouseMove}
              >
                {/* Card */}
                <div 
                  className="relative h-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 hover:bg-white hover:shadow-2xl border border-orange-100 overflow-hidden"
                  style={{ 
                    boxShadow: isHovered 
                      ? '0 25px 50px -12px rgba(251, 146, 60, 0.25)' 
                      : '0 4px 20px -6px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Spotlight Effect */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(251, 146, 60, 0.15), transparent 40%)`,
                      }}
                    />
                  )}

                  {/* Gradient Orb */}
                  <div 
                    className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-500"
                    style={{ background: `linear-gradient(to bottom left, #FF6B35, #D32F2F)` }}
                  />

                  {/* Icon with Gradient */}
                  <div 
                    className={`relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 bg-gradient-to-br ${service.color}`}
                  >
                    <Icon className="w-10 h-10 text-white" strokeWidth={2.2} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-orange-700">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* CTA */}
                    <button className="inline-flex items-center gap-2 font-semibold text-orange-600 group-hover:text-red-600 group-hover:gap-4 transition-all duration-300">
                      <span>Explore</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Corner Decor */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div 
                      className="absolute bottom-0 right-0 w-full h-full opacity-20 rounded-tl-full"
                      style={{ background: `linear-gradient(to top left, #FF6B35, #D32F2F)` }}
                    />
                  </div>
                </div>

                {/* Floating Glow */}
                <div 
                  className="absolute inset-0 -z-10 rounded-3xl blur-3xl transition-all duration-500 opacity-0 group-hover:opacity-100 group-hover:scale-105"
                  style={{ background: `linear-gradient(to bottom right, rgba(251, 146, 60, 0.2), rgba(211, 47, 47, 0.2))` }}
                />
              </div>
            );
          })}
        </div>

        {/* CTA Footer */}
        <div className="text-center mt-16">
          <a
            href="/get-started"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="w-6 h-6" />
          </a>
        </div>
      </div>
    </section>
  );
}