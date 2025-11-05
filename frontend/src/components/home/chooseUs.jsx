'use client';

import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Shield, 
  MapPin, 
  Star, 
  TrendingUp,
  Smartphone,
  CreditCard,
  Store
} from 'lucide-react';

export default function AbyWhyChooseUs() {
  const [activeCard, setActiveCard] = useState(null);

  const features = [
    {
      icon: CalendarCheck,
      title: 'Easy Online Booking & Ordering',
      description: 'Book tables, schedule salon visits, or order groceries in seconds — all through a simple, intuitive interface.',
     image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=600&h=400&fit=crop',
 
    },
    {
      icon: CreditCard,
      title: 'Secure Local Payments',
      description: 'Pay seamlessly with MTN MoMo, Airtel Money, or card — all transactions are encrypted and Rwanda-compliant.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    
    },
    {
      icon: MapPin,
      title: 'Location-Based Discovery',
      description: 'Find the best restaurants, salons, and shops near you in Kigali — filtered by proximity, ratings, and availability.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    },
    {
      icon: Star,
      title: 'Verified & Trusted Providers',
      description: 'Every business is vetted and reviewed by real users, ensuring quality, reliability, and peace of mind.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=400&fit=crop',
    },
    {
      icon: TrendingUp,
      title: 'Empowering Local Entrepreneurs',
      description: 'We help Rwandan businesses go digital, reach more customers, and grow sustainably in the modern economy.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
    },
  ];

  return (
    <div className="w-full py-16 md:py-24 px-4 md:px-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto ">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
            <p className="font-semibold text-sm md:text-base tracking-wider uppercase text-primary-600">
              Why Aby Booking
            </p>
            <div className="w-2 h-2 rounded-full bg-primary-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900">
            Why Choose
            <br />
            <span className="text-primary-600">Aby Booking?</span>
          </h2>
          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-gray-600">
            Experience seamless discovery, booking, and payment — all in one trusted platform built for Rwanda.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeCard === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
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
                    <div className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                      isActive ? 'bg-primary-600 scale-110' : 'bg-white/90'
                    }`}>
                      <Icon
                        className={`w-6 h-6 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-primary-600'
                        }`}
                        strokeWidth={2}
                      />
                    </div>
                  </div>

                  {/* Number Badge */}
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">{index + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Animated Line */}
                  <div className={`h-1 rounded-full transition-all duration-500 ${
                    isActive 
                      ? 'w-full bg-gradient-to-r from-primary-600 to-primary-400' 
                      : 'w-12 bg-gray-300'
                  }`}></div>
                </div>

                {/* Hover Glow */}
                <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/10 to-transparent"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <button className="group inline-flex items-center gap-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Get Started Now
            <Smartphone className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}