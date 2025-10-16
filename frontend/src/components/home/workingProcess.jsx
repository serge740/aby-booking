import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaRocket, FaClipboardList, FaCheckCircle, FaCog, FaHeadset, FaChevronDown } from 'react-icons/fa';
import banner2 from "../../assets/banners/banner-img2.png";

export default function WorkProcess() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-in-out' });
  }, []);

  const steps = [
    {
      icon: FaRocket,
      title: 'Get Started',
      description: 'Begin your journey with our expert-driven development process, ensuring a smooth onboarding experience.',
      number: '01',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
    },
    {
      icon: FaClipboardList,
      title: 'Requirement Gathering',
      description: 'We gather and analyze all project requirements, aligning business goals with technical needs.',
      number: '02',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
    },
    {
      icon: FaCog,
      title: 'Planning & Strategy',
      description: 'We outline a clear roadmap, define milestones, and strategize the best approach to ensure seamless execution.',
      number: '03',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
    },
    {
      icon: FaCheckCircle,
      title: 'Development & Execution',
      description: 'Our expert developers bring the vision to life, coding and building scalable, secure solutions.',
      number: '04',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
    },
    {
      icon: FaHeadset,
      title: 'Deployment & Support',
      description: 'We launch your project successfully and provide ongoing maintenance, support, and updates.',
      number: '05',
      gradient: 'from-indigo-500 to-blue-500',
      bgGradient: 'from-indigo-50 to-blue-50',
    },
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 md:py-24 px-6 md:px-13 overflow-hidden">
      <div className="mx-auto max-w-8xl">
        
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 -mt-8">
            Our <span className="bg-gradient-to-r from-primary-500 to-blue-500 bg-clip-text text-transparent">Working</span> Process
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl leading-relaxed mx-auto">
            We follow a structured and transparent process to deliver exceptional results for every project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* Left Section - Accordion */}
          <div className="space-y-4" data-aos="fade-right">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeIndex === index;
              
              return (
                <div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ${
                    isActive ? 'shadow-2xl' : 'shadow-md hover:shadow-lg'
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Gradient Border Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.gradient} opacity-0 ${isActive ? 'opacity-100' : ''} transition-opacity duration-500`}></div>
                  
                  <div className={`relative ${isActive ? 'm-0.5' : 'm-0'} bg-white rounded-2xl transition-all duration-500`}>
                    
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center gap-4 md:gap-6 p-5 md:p-6 text-left transition-all duration-300"
                    >
                      {/* Animated Number Circle */}
                      <div className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${step.gradient} rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                        isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                      }`}>
                        <span className="text-white font-bold text-lg md:text-xl">{step.number}</span>
                        
                        {/* Pulse Animation */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
                        )}
                      </div>

                      {/* Title & Icon */}
                      <div className="flex-1">
                        <h3 className={`text-xl md:text-2xl font-bold transition-all duration-300 ${
                          isActive ? `bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent` : 'text-gray-900'
                        }`}>
                          {step.title}
                        </h3>
                      </div>

                      {/* Chevron Icon */}
                      <FaChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${
                          isActive ? 'rotate-180 text-primary-500' : 'rotate-0'
                        }`}
                      />
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className={`px-5 md:px-6 pb-5 md:pb-6 pt-0`}>
                        {/* Gradient Line Separator */}
                        <div className={`h-0.5 bg-gradient-to-r ${step.gradient} mb-4 rounded-full transform origin-left transition-all duration-700 ${
                          isActive ? 'scale-x-100' : 'scale-x-0'
                        }`}></div>
                        
                        {/* Description with gradient background */}
                        <div className={`relative p-4 md:p-5 rounded-xl bg-gradient-to-br ${step.bgGradient} transform transition-all duration-500 ${
                          isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}>
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 mt-1 text-transparent bg-gradient-to-br ${step.gradient} bg-clip-text flex-shrink-0`} />
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                          
                          {/* Decorative Corner Element */}
                          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${step.gradient} opacity-5 rounded-bl-full`}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Section - Animated Image */}
          <div className="flex flex-col gap-8" data-aos="fade-left">
            {/* Top Image */}
            <div className="relative w-full">
              {/* Subtle Gradient Orb */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-full blur-3xl opacity-10"></div>
              
              {/* Image Container */}
              <div className="relative bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <img
                  src={banner2}
                  alt="work progress image 1"
                  className="w-full h-64 md:h-80 object-contain rounded-xl transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Bottom Image */}
            <div className="relative w-full">
              {/* Subtle Gradient Orb */}
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-10"></div>
              
              {/* Image Container */}
              <div className="relative bg-white rounded-2xl p-4 md:p-6 shadow-lg">
                <img
                  src={banner2}
                  alt="work progress image 2"
                  className="w-full h-64 md:h-80 object-contain rounded-xl transform transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}