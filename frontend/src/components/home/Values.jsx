import React from 'react';
import { Coffee, Bean, CupSoda } from 'lucide-react';
import Image from '../../assets/coffe/coffee_slide-3.jpg'; // Replace with an image of your café or coffee beans

function Values() {
  return (
    <div className="bg-[#6f4e37] relative overflow-hidden px-10 py-2">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6 py-4 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/40">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span className="text-white font-medium">Our Coffee Philosophy</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-2xl xl:text-2xl font-bold text-white leading-tight">
              What Makes Jambokawa Special
            </h1>

            {/* Description */}
            <p className="text-white/90 text-lg lg:text-xl leading-relaxed">
              At Jambokawa Coffee, we believe every cup tells a story — from handpicked beans to your final sip. 
              We blend tradition, sustainability, and passion to craft the perfect brew that warms both heart and soul.
            </p>

            {/* Values */}
            <div className="space-y-6 pt-4">
              {/* Artisan Roasting */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                  <Bean className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Artisan Roasting</h3>
                  <p className="text-white/80">
                    Our beans are small-batch roasted to perfection, bringing out rich, distinctive flavors.
                  </p>
                </div>
              </div>

              {/* Sustainable Sourcing */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Sustainable Sourcing</h3>
                  <p className="text-white/80">
                    We partner directly with farmers across Africa to ensure fair trade and ethical practices.
                  </p>
                </div>
              </div>

              {/* Community & Comfort */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                  <CupSoda className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white mb-1">Community & Comfort</h3>
                  <p className="text-white/80">
                    A welcoming space for connection, creativity, and relaxation — where every guest feels at home.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20 backdrop-blur-sm">
              <img
                src={Image}
                alt="Freshly brewed coffee and cozy interior"
                className="w-full object-cover h-[500px]"
              />
              {/* Overlay icon in top-left */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-[#4b3621]/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Values;
