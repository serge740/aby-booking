import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Image from '../../assets/images/about1.png'

function HomeAbout() {
  const services = [
    { name: 'Specialty Coffee', col: 1 },
    { name: 'Artisan Brewing', col: 2 },
    { name: 'Cozy Atmosphere', col: 1 },
    { name: 'Fresh Pastries', col: 2 }
  ];

  return (
    <div className="bg-[#f8f6f2] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Coffee shop image */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={Image}
                alt="Coffee shop interior" 
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#c0aa83] rounded-full opacity-30 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#c0aa83] rounded-full opacity-30 blur-xl"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#c0aa83] rounded-full"></div>
                <div className="w-2 h-2 bg-[#c0aa83] rounded-full opacity-60"></div>
                <div className="w-2 h-2 bg-[#c0aa83] rounded-full opacity-40"></div>
                <div className="w-2 h-2 bg-[#c0aa83] rounded-full opacity-20"></div>
              </div>
              <span className="text-[#c0aa83] font-semibold tracking-wide text-sm uppercase">
                About Jambokawa
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              We Craft Perfect Coffee Experiences
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
              At Jambokawa, we believe every cup tells a story. From bean to brew, we pour passion into creating memorable moments and the perfect coffee experience for our community.
            </p>

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#c0aa83]/10"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-[#c0aa83]" />
                  </div>
                  <span className="text-gray-800 font-semibold text-base">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="-pt-16">
              <button className="bg-[#c0aa83] hover:bg-[#b39a76] text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Our Story
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeAbout;