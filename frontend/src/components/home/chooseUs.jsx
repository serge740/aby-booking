import React, { useState } from 'react';
import { Shield, Users, Lock, Cpu, Code } from 'lucide-react';

export default function WhyChooseUs() {
  const [highlighted, setHighlighted] = useState(null);

  const services = [
    {
      icon: Code,
      title: 'Web Development',
      description: 'Building modern, responsive applications using technologies such as React, JavaScript, and related frameworks to create high-impact digital products.',
      path: '/services',
    },
    {
      icon: Cpu,
      title: 'Software Solutions',
      description: 'Delivering cutting-edge software solutions that drive businesses forward and transform ideas into impactful digital experiences.',
      path: '/services',
    },
    {
      icon: Users,
      title: 'IT Training',
      description: 'Empowering local talent through coding workshops and digital skills programs, supporting innovation within Rwanda’s growing tech ecosystem.',
      path: '/services',
    },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 py-4 md:py-24 px-4 md:px-8">
      <div className="max-w-8xl px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="flex items-center justify-center gap-2 -mt-10">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <p className="text-blue-500 font-semibold text-sm md:text-base tracking-wider uppercase">Our Solutions</p>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Why We Stand Out <br /> Choose Us Today
          </h2>

          <p className="text-gray-500 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Discover innovative solutions tailored to your needs, crafted with precision and a passion for excellence in technology.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 -mt-10">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                onClick={() => setHighlighted(index)}
                className={`relative p-8 md:p-10 rounded-2xl bg-white border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  highlighted === index ? 'border-blue-400 shadow-md' : 'hover:border-blue-200'
                }`}
              >
                {/* Subtle Card Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div
                    className={`p-4 rounded-full transition-colors duration-300 ${
                      highlighted === index ? 'bg-blue-100' : 'bg-gray-100'
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 transition-colors duration-300 ${
                        highlighted === index ? 'text-blue-500' : 'text-gray-600'
                      }`}
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-sm md:text-base text-center mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Link */}
                <a
                  href={service.path}
                  className="text-blue-500 font-medium text-center block hover:text-blue-600 transition-colors duration-300 text-sm md:text-base"
                >
                  View Details →
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}