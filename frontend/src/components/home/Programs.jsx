import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

export default function AbyDeliverySection() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const galleryImages = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % (galleryImages.length * 2));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-orange-50 to-white py-16 md:py-24 px-4">
      <div className=" mx-auto">
        {/* Gallery Strip */}
        <div className="relative mb-16 overflow-hidden rounded-3xl shadow-2xl">
          <div 
            className="flex  transition-transform duration-1000 ease-linear"
            style={{
              transform: `translateX(-${(scrollPosition * 100) / galleryImages.length}%)`
            }}
          >
            {[...galleryImages, ...galleryImages].map((image, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-80 h-56  overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-orange-50 to-transparent pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Large Food Image */}
          <div className="relative ">
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-orange-200 rounded-full opacity-30 blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-red-200 rounded-full opacity-30 blur-2xl"></div>
            
            {/* Single Large Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=800&fit=crop"
                alt="Delicious Food"
                className="w-full h-[60vh] object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Delivery Badge */}
              <div className="absolute top-6 right-6 bg-gradient-to-r from-red-600 to-orange-600 px-6 py-3 rounded-full shadow-lg animate-pulse">
                <p className="text-white font-bold text-lg">Fast Delivery</p>
              </div>
              
              {/* Bottom Info */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                  <p className="text-white font-bold text-xl mb-1">30 Min Delivery</p>
                  <p className="text-white/80 text-sm">Hot & Fresh to Your Door</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-block">
              <p className="text-red-600 italic text-lg md:text-xl font-semibold">
                Delivery
              </p>
            </div>

            {/* Main Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-gray-900">A Moments Of Delivered</span>
              <br />
              <span className="text-red-600">On Right Time & Place</span>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
              Food Khan is a restaurant, bar and coffee roastery located on a busy corner site in Farringdon's Exmouth Market. With glazed frontage on two sides of the building, overlooking the market and a bustling London inteon.
            </p>

            {/* Delivery Contact Card */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                {/* Delivery Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>

                {/* Contact Info */}
                <div>
                  <p className="text-gray-600 text-sm mb-1">Delivery Order Num.</p>
                  <a href="tel:123-59794069" className="text-red-600 text-2xl font-bold hover:text-red-700 transition-colors">
                    123-59794069
                  </a>
                </div>
              </div>

              {/* Order Button */}
              <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-10 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Order Now
              </button>
            </div>

            {/* Additional Features */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fast Delivery</p>
                  <p className="text-sm text-gray-600">Within 30 minutes</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fresh Food</p>
                  <p className="text-sm text-gray-600">Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}