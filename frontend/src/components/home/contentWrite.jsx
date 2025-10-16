import React, { useEffect } from 'react';
import { FaPencilRuler, FaCode, FaUserGraduate, FaArrowRight } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { MdSupportAgent } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import AOS from 'aos';
import 'aos/dist/aos.css';

const services = [
  {
    title: 'Web Development',
    icon: <FaPencilRuler size={40} />,
    description:
      'We design and develop modern, high-performance websites tailored to your brand identity. Our solutions ensure responsiveness, speed, and seamless user experience.',
  },
  {
    title: 'App Development',
    icon: <IoDocumentTextSharp size={40} />,
    description:
      'From mobile to web apps, we create high-quality, scalable, and intuitive applications with smooth functionality and stunning UI.',
  },
  {
    title: 'Software Development',
    icon: <FaCode size={40} />,
    description:
      'We build customized software solutions designed to meet your unique business needs with security and scalability.',
  },
  {
    title: 'E-Commerce Solutions',
    icon: <AiOutlineShoppingCart size={40} />,
    description:
      'We develop robust, scalable e-commerce platforms with seamless payment gateways and inventory management.',
  },
  {
    title: 'IT Support',
    icon: <MdSupportAgent size={40} />,
    description:
      'Reliable IT support ensures your business operates smoothly with proactive troubleshooting and network security.',
  },
  {
    title: 'Internship Program',
    icon: <FaUserGraduate size={40} />,
    description:
      'Gain hands-on experience through our well-structured internship program with mentorship and real project work.',
  },
];

export default function ServicesSection() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: 'ease-in-out' });
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4 md:px-8">
      <div className=" mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our <span className="text-primary-500">Services</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            We provide high-quality digital solutions tailored to your needs and business requirements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group relative"
            >
              <div className="h-full bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-10 transition-all duration-300 hover:border-primary-500 hover:shadow-xl overflow-hidden">
                
                {/* Background decoration */}
                <div className="absolute top-10 right-10 w-16 h-16 bg-primary-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon Container */}
                <div className="relative z-10 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl mb-6 group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-300">
                  <div className="text-primary-500">
                    {service.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 relative z-10">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6 relative z-10 line-clamp-4">
                  {service.description}
                </p>

                {/* Arrow Button */}
                <div className="absolute bottom-8 right-8 z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                    <FaArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}