import React, { useState } from 'react';
import { Utensils, Clock, Award, Heart } from 'lucide-react';

export default function AbyWhyChooseUs() {
  const [activeCard, setActiveCard] = useState(null);

  const features = [
    {
      icon: Utensils,
      title: 'Fresh Ingredients',
      description: 'We source only the finest, freshest ingredients from local farms and trusted suppliers to ensure every dish is packed with authentic flavor and nutrition.',
      image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600&h=400&fit=crop',
    },
    {
      icon: Award,
      title: 'Award-Winning Chefs',
      description: 'Our culinary team brings years of expertise and passion, creating dishes that have earned recognition and delighted countless guests.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=400&fit=crop',
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Enjoy restaurant-quality meals delivered hot and fresh to your door within 30 minutes. Quality and speed guaranteed.',
      image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop',
    },
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every dish is prepared with care and attention to detail, ensuring you taste the love in every bite we serve.',
      image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop',
    },
  ];

  return (
    <div className="w-full py-16 md:py-24 px-4 md:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <p className="font-semibold text-sm md:text-base tracking-wider uppercase text-orange-600">
              Why Aby Restaurant
            </p>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Why We Stand Out
            <br />
            <span className="text-orange-600">Choose Us Today</span>
          </h2>

          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-gray-600">
            Experience exceptional dining with our commitment to quality, service, and unforgettable flavors that keep you coming back.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeCard === index;
            
            return (
              <div
                key={index}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 right-4">
                    <div className={`p-3 rounded-full transition-all duration-300 ${
                      isActive ? 'bg-orange-600 scale-110' : 'bg-white/90'
                    }`}>
                      <Icon
                        className={`w-6 h-6 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-orange-600'
                        }`}
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Decorative Line */}
                  <div className={`h-1 rounded-full transition-all duration-500 ${
                    isActive ? 'w-full bg-gradient-to-r from-orange-600 to-red-600' : 'w-12 bg-gray-300'
                  }`}></div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 to-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Discover Our Menu
          </button>
        </div>
      </div>
    </div>
  );
}