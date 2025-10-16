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
      description: 'Empowering local talent through coding workshops and digital skills programs, supporting innovation within Rwandas growing tech ecosystem.',
      path: '/services',
    },
  ];

  return (
    <div className="w-full py-4 md:py-24 px-4 md:px-8 bg-white">
      <div className="max-w-8xl px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-20">
          <div className="flex items-center justify-center gap-2 -mt-10">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c0aa83' }}></div>
            <p className="font-semibold text-sm md:text-base tracking-wider uppercase" style={{ color: '#c0aa83' }}>Our Solutions</p>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c0aa83' }}></div>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight" style={{ color: '#c0aa83' }}>
            Why We Stand Out <br /> Choose Us Today
          </h2>

          <p className="text-base md:text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#c0aa83' }}>
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
                className="relative p-8 md:p-10 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
                style={{ 
                  boxShadow: highlighted === index 
                    ? '0 10px 40px rgba(192, 170, 131, 0.5)' 
                    : '0 4px 20px rgba(192, 170, 131, 0.25)',
                }}
                onMouseEnter={(e) => {
                  if (highlighted !== index) {
                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(192, 170, 131, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (highlighted !== index) {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(192, 170, 131, 0.25)';
                  }
                }}
              >
                {/* Icon */}
                <div className="mb-6 flex justify-center">
                  <div
                    className="p-4 rounded-full transition-colors duration-300"
                    style={{ 
                      backgroundColor: highlighted === index ? 'rgba(192, 170, 131, 0.2)' : 'rgba(192, 170, 131, 0.1)'
                    }}
                  >
                    <Icon
                      className="w-8 h-8 transition-colors duration-300"
                      style={{ 
                        color: '#c0aa83'
                      }}
                      strokeWidth={2}
                    />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-semibold text-black mb-4 text-center">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-black text-sm md:text-base text-center mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Link */}
                <a
                  href={service.path}
                  className="font-medium text-center block transition-colors duration-300 text-sm md:text-base"
                  style={{ color: '#c0aa83' }}
                  onMouseEnter={(e) => e.target.style.color = '#a08968'}
                  onMouseLeave={(e) => e.target.style.color = '#c0aa83'}
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