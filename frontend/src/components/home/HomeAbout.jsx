import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Image from '../../assets/images/about1.png'

function HomeAbout() {
  const services = [
    { name: 'Big Data', col: 1 },
    { name: 'Data Visualization', col: 2 },
    { name: 'Data Warehousing', col: 1 },
    { name: 'Data Management', col: 2 }
  ];

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Illustration */}
          <div className="relative">
            <div className="relative z-10">
              <img 
                src={Image}
                alt="Team collaboration" 
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-200 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-200 rounded-full opacity-60 blur-xl"></div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              </div>
              <span className="text-primary-500 font-semibold tracking-wide text-sm uppercase">
                About Us
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              We Are Dynamic Team Of SEO Agency
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed">
  We believe in building with purpose — combining creativity and technology to bring ideas to life.
</p>


            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-primary-500" />
                  </div>
                  <span className="text-gray-800 font-semibold text-base">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>

          

            {/* CTA Button */}
            <div className="-pt-8">
              <button className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-4 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                More About Us
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