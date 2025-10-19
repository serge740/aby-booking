import React from 'react';

export default function AbyRestaurantAbout() {
  return (
    <div className="w-full bg-gray-50 py-16 md:py-24 px-4 md:px-16">
      <div className=" mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Dynamic Grid Layout */}
          <div className="relative">
            <div className="grid grid-cols-3 grid-rows-4 gap-4 h-[700px]">
              {/* Large Burger - Takes 2 columns, 2 rows */}
              <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=800&fit=crop"
                  alt="Delicious burger"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Stats Card - 1 column, 2 rows */}
              <div className="col-span-1 row-span-2 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 transform hover:scale-[1.02] transition-transform duration-300">
                <div className="text-white mb-3">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-white text-4xl font-bold mb-1">2000+</h3>
                <p className="text-white text-sm font-medium text-center">Food Items</p>
              </div>

              {/* People eating - 2 columns, 2 rows */}
              <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
                  alt="Happy customers"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gourmet Burger - 1 column, 2 rows */}
              <div className="col-span-1 row-span-2 overflow-hidden rounded-2xl shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=800&fit=crop"
                  alt="Gourmet burger"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Decorative floating elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-400 rounded-full opacity-10 blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-400 rounded-full opacity-10 blur-2xl"></div>
          </div>

          {/* Right Side - Content */}
          <div className="text-gray-900 space-y-6">
            <div>
              <p className="text-sm md:text-base font-light tracking-wider mb-3 text-primary-600 uppercase">
                About Aby Restaurant
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Fresh Taste At A Great Price, Only For{' '}
                <span className="text-primary-600">Hungry People.</span>
              </h2>
            </div>

            <div className="space-y-5 text-gray-600">
              <p className="text-base md:text-lg leading-relaxed">
                Food is a restaurant, bar and coffee roastery located on a busy corner site in Farringdon's Exmouth Market. With glazed.
              </p>
             
              <p className="text-base md:text-lg leading-relaxed">
                We source our ingprimaryients from local farms and markets, ensuring every dish is prepaprimary with the freshest produce. Our skilled chefs are dedicated to crafting memorable culinary experiences that blend traditional recipes with modern creativity.
              </p>

              <p className="text-base md:text-lg leading-relaxed">
                More than just a restaurant, we've created a welcoming space where families gather, celebrations happen, and every meal becomes a cherished memory.
              </p>
            </div>

            {/* Feature Card */}
            <div className="flex items-start gap-4 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop"
                    alt="Garlic Burger"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-primary-600 text-white text-xs font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
                  $15
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Garlic Burger Parties
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  It is a long established fact that a reader BBQ food Chicken.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button className="px-8 py-3 bg-transparent border-2 border-primary-600 text-primary-600 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300 font-medium text-base">
                View Our Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}