import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  FaCoffee,
  FaSeedling, // Replaced FaBeans with FaSeedling
  FaStore,
  FaMugHot,
  FaHeart,
  FaChevronDown,
} from 'react-icons/fa';
import banner2 from '../../assets/banners/banner-img2.png';

export default function WorkProcess() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-in-out' });
  }, []);

const steps = [
  {
    icon: FaCoffee, // Placeholder for a coffee cup icon
    title: 'Welcome to Jambokawa',
    description:
      'Start your coffee shop journey with our passionate team, ensuring a warm and inviting onboarding experience.',
    number: '01',
    bgColor: '#8B4513', // Rich coffee brown
    bgLightColor: '#8B451320', // Light coffee brown with transparency
  },
  {
    icon: FaSeedling, // Placeholder for a coffee bean icon
    title: 'Menu Planning',
    description:
      'We craft the perfect menu by selecting premium coffee beans and curating delicious offerings to delight your customers.',
    number: '02',
    bgColor: '#8B4513',
    bgLightColor: '#8B451320',
  },
  {
    icon: FaStore, // Placeholder for a shop or storefront icon
    title: 'Shop Design & Setup',
    description:
      'We design a cozy, inviting space and plan the layout to ensure a seamless flow for customers and staff.',
    number: '03',
    bgColor: '#8B4513',
    bgLightColor: '#8B451320',
  },
  {
    icon: FaMugHot, // Placeholder for a steaming mug icon
    title: 'Brewing & Training',
    description:
      'Our expert baristas bring the vision to life, crafting perfect brews and training staff for exceptional service.',
    number: '04',
    bgColor: '#8B4513',
    bgLightColor: '#8B451320',
  },
  {
    icon: FaHeart, // Placeholder for a heart or customer service icon
    title: 'Grand Opening & Support',
    description:
      'We launch your Jambokawa Coffee Shop with flair and provide ongoing support to keep customers coming back.',
    number: '05',
    bgColor: '#8B4513',
    bgLightColor: '#8B451320',
  },
];
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-jambokawa py-16 md:py-24 px-6 md:px-13 overflow-hidden">
      <div className="mx-auto max-w-8xl">
        {/* Header */}
        <div className="mb-16 md:mb-20 text-center" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 -mt-8">
            Our{' '}
            <span className="bg-[#6F4E37] bg-clip-text text-transparent">
              Working
            </span>{' '}
            Process
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
                  {/* Solid Color Border Effect */}
                  <div
                    className={`absolute inset-0 opacity-0 transition-opacity duration-500 ${
                      isActive ? 'opacity-100' : ''
                    }`}
                    style={{ backgroundColor: step.bgColor }}
                  ></div>

                  <div
                    className={`relative ${isActive ? 'm-0.5' : 'm-0'} bg-white rounded-2xl transition-all duration-500`}
                  >
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full flex items-center gap-4 md:gap-6 p-5 md:p-6 text-left transition-all duration-300"
                    >
                      {/* Animated Number Circle */}
                      <div
                        className={`relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                          isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                        }`}
                        style={{ backgroundColor: step.bgColor }}
                      >
                        <span className="text-white font-bold text-lg md:text-xl">
                          {step.number}
                        </span>

                        {/* Pulse Animation */}
                        {isActive && (
                          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
                        )}
                      </div>

                      {/* Title & Icon */}
                      <div className="flex-1">
                        <h3
                          className={`text-xl md:text-2xl font-bold transition-all duration-300 ${
                            isActive ? 'text-transparent bg-clip-text' : 'text-gray-900'
                          }`}
                          style={isActive ? { backgroundImage: `linear-gradient(${step.bgColor}, ${step.bgColor})` } : {}}
                        >
                          {step.title}
                        </h3>
                      </div>

                      {/* Chevron Icon */}
                      <FaChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform duration-500 ${
                          isActive ? 'rotate-180' : 'rotate-0'
                        }`}
                        style={isActive ? { color: step.bgColor } : {}}
                      />
                    </button>

                    {/* Accordion Content */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ${
                        isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                        {/* Solid Color Line Separator */}
                        <div
                          className={`h-0.5 mb-4 rounded-full transform origin-left transition-all duration-700 ${
                            isActive ? 'scale-x-100' : 'scale-x-0'
                          }`}
                          style={{ backgroundColor: step.bgColor }}
                        ></div>

                        {/* Description with light background */}
                        <div
                          className={`relative p-4 md:p-5 rounded-xl transform transition-all duration-500 ${
                            isActive
                              ? 'translate-y-0 opacity-100'
                              : 'translate-y-4 opacity-0'
                          }`}
                          style={{ backgroundColor: step.bgLightColor }}
                        >
                          <div className="flex items-start gap-3">
                            <Icon
                              className="w-5 h-5 mt-1 flex-shrink-0"
                              style={{
                                color: step.bgColor,
                              }}
                            />
                            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                              {step.description}
                            </p>
                          </div>

                          {/* Decorative Corner Element */}
                          <div
                            className="absolute top-0 right-0 w-20 h-20 opacity-5 rounded-bl-full"
                            style={{ backgroundColor: step.bgColor }}
                          ></div>
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
              {/* Subtle Solid Color Orb */}
              <div
                className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-10"
                style={{ backgroundColor: '#c0aa83' }}
              ></div>

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
              {/* Subtle Solid Color Orb */}
              <div
                className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl opacity-10"
                style={{ backgroundColor: '#c0aa83' }}
              ></div>

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
