import React, { useState } from 'react';
import { Coffee, Truck, Users, Star, ShoppingCart, Handshake, ArrowRight, Sparkles } from 'lucide-react';

const services = [
  {
    title: 'Premium Coffee Blends',
    icon: Coffee,
    description: 'Discover the best world sorts of coffee beans, sourced globally and roasted to perfection for an unparalleled taste experience.',
  },
  {
    title: 'Professional Barista Services',
    icon: Star,
    description: 'Our skilled baristas craft exceptional coffee beverages with precision, ensuring every cup is a masterpiece of flavor and aroma.',
  },
  {
    title: '24/7 Fast Delivery',
    icon: Truck,
    description: 'Enjoy our premium coffee products delivered to your door with our reliable and swift 24/7 delivery service.',
  },
  {
    title: 'Multiple Points of Sale',
    icon: ShoppingCart,
    description: 'Visit our numerous coffee shops and outlets for a cozy experience or to grab your favorite coffee on the go.',
  },
  {
    title: 'Become Our Dealer',
    icon: Handshake,
    description: 'Join our network as a CoffeeKing dealer and bring our premium coffee products to your community with exclusive benefits.',
  },
  {
    title: 'Coffee Tasting Events',
    icon: Users,
    description: 'Participate in our coffee tasting events to explore new blends, learn about coffee origins, and connect with fellow coffee lovers.',
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
    <section className="relative py-4 md:py-17 px-4 md:px-8 bg-gradient-to-b from-stone-50 via-stone-100/30 to-stone-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#a38e6a]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className=" mx-auto relative z-10">
        {/* Header */}
        {/* <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: 'linear-gradient(to right, rgba(192, 170, 131, 0.15), rgba(163, 142, 106, 0.15))' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#6F4E37' }} />
            <span className="text-sm font-semibold tracking-wide" style={{ color: '#a38e6a' }}>WHAT WE OFFER</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            Crafting Coffee
            <br />
            <span style={{ color: '#6F4E37' }}>Experiences</span>
          </h2>
          
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            From bean to cup, we deliver excellence in every aspect of your coffee journey
          </p>
        </div> */}

        {/* Services Grid */}
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
                onMouseMove={(e) => handleMouseMove(e, index)}
              >
                <div className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 transition-all duration-500 hover:bg-white hover:shadow-2xl border border-gray-200/50 overflow-hidden" style={{ boxShadow: isHovered ? '0 25px 50px -12px rgba(192, 170, 131, 0.15)' : '' }}>
                  {/* Spotlight Effect */}
                  {isHovered && (
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(192, 170, 131, 0.1), transparent 40%)`,
                      }}
                    ></div>
                  )}

                  {/* Gradient Orb */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-500" style={{ background: 'linear-gradient(to bottom right, #6F4E37, #a38e6a)' }}></div>

                  {/* Icon */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" style={{ background: 'linear-gradient(to bottom right, #6F4E37, #a38e6a)' }}>
                    <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 transition-colors duration-300" style={{ color: isHovered ? '#a38e6a' : '' }}>
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-8 group-hover:text-gray-700 transition-colors duration-300">
                      {service.description}
                    </p>

                    {/* CTA Button */}
                    <button className="inline-flex items-center gap-2 font-semibold group-hover:gap-4 transition-all duration-300" style={{ color: '#6F4E37' }}>
                      <span>Learn More</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>

                  {/* Decorative Corner */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-0 right-0 w-full h-full opacity-10 rounded-tl-full" style={{ background: 'linear-gradient(to top left, #6F4E37, #a38e6a)' }}></div>
                  </div>
                </div>

                {/* Floating Animation on Hover */}
                <div className="absolute inset-0 -z-10 rounded-3xl blur-2xl transition-all duration-500 group-hover:scale-105" style={{ background: isHovered ? 'linear-gradient(to bottom right, rgba(192, 170, 131, 0.2), rgba(163, 142, 106, 0.2))' : '' }}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}