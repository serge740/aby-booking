import React from 'react';

export default function CafeAboutSection() {
  return (
    <div id='our-story' className="min-h-screen bg-primary-800 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Image Card */}
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            {/* Image */}
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=900&fit=crop"
              alt="Cafe Interior"
              className="w-full h-[600px] object-cover"
            />
           
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-950/80"></div>
           
            {/* Bottom Text */}
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                Brewing Excellence Since 2015
              </h3>
              <p className="text-2xl md:text-3xl font-bold">
                Your Neighborhood Coffee Haven
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="text-white space-y-6">
          <div>
            <p className="text-sm md:text-base font-light tracking-wider mb-3 text-primary-200">
              Artisan Coffee & Community
            </p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Our Story
            </h2>
          </div>

          <div className="space-y-5 text-white/90">
            <p className="text-base md:text-lg leading-relaxed">
              What started as a passion for exceptional coffee has grown into a warm gathering place where the aroma of freshly roasted beans welcomes you every morning.
            </p>
           
            <p className="text-base md:text-lg leading-relaxed">
              We source our beans directly from sustainable farms across Ethiopia, Colombia, and Guatemala, ensuring every cup tells a story of quality and craftsmanship. Our skilled baristas are dedicated to perfecting each brew, whether it's a classic espresso or a creative seasonal specialty.
            </p>

            <p className="text-base md:text-lg leading-relaxed">
              More than just coffee, we've built a community space where friends meet, ideas flourish, and every visit feels like coming home.
            </p>
          </div>

          <div className="pt-4">
            <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-primary-900 transition-all duration-300 font-medium text-base">
              Meet Our Baristas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}