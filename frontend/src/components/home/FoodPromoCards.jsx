import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function AbyPromoCards() {
  return (
    <div className="w-full bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 px-4 md:px-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <p className="text-orange-600 text-sm md:text-base font-semibold italic uppercase tracking-wider">
              Special Offers
            </p>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Today's <span className="text-red-600">Hot Deals</span>
          </h2>
        </div>

        {/* Hierarchical Grid Layout */}
        <div className="grid grid-cols-12 gap-4 auto-rows-auto">
          {/* Card 1 - HERO (Large Featured) - Spans 8 columns, 2 rows */}
          <div 
            className="col-span-12 lg:col-span-8 row-span-2 rounded-3xl overflow-hidden relative h-96 lg:h-[600px] group cursor-pointer shadow-2xl"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&h=800&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent group-hover:from-black/95 transition-all duration-500"></div>
            
            {/* Floating Badge */}
            <div className="absolute top-6 right-6 z-10 animate-bounce">
              <div className="bg-gradient-to-br from-red-600 to-red-500 text-white font-bold text-center px-6 py-3 rounded-full shadow-2xl border-4 border-white">
                <div className="text-sm uppercase">Save</div>
                <div className="text-3xl">50%</div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center p-8 md:p-12 lg:p-16">
              <div className="z-10 max-w-xl">
                <span className="inline-block bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full mb-4">
                  LIMITED TIME OFFER
                </span>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                  Signature Burger Combo
                </h2>
                <p className="text-white/90 text-xl md:text-2xl mb-8 font-light">
                  Sale off 50% only this week
                </p>
                <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center gap-3 group">
                  ORDER NOW
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Decorative Corner */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-red-500/30 to-transparent rounded-tl-full"></div>
          </div>

          {/* Card 2 - Medium Tall (Pizza) - Spans 4 columns, 2 rows */}
          <div 
            className="col-span-12 lg:col-span-4 row-span-2 rounded-3xl overflow-hidden relative h-64 lg:h-[600px] group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow duration-300"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=800&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/95 via-green-800/70 to-green-700/50 group-hover:from-green-900/100 transition-all duration-500"></div>
            
            <div className="absolute top-6 right-6 z-10">
              <div className="bg-red-600 text-white font-bold text-2xl w-20 h-20 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                $15
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                Super Delicious Pizza
              </h3>
              <div className="flex items-center gap-2 text-white font-semibold text-lg group-hover:gap-3 transition-all">
                ORDER NOW
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Card 3 - Small Square (Orange Burger) - Spans 4 columns, 1 row */}
          <div 
            className="col-span-6 lg:col-span-4 rounded-3xl overflow-hidden relative h-72 group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=600&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-orange-500/75 to-yellow-500/60 group-hover:from-orange-700/95 transition-all duration-500"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Combo Burger
                </h3>
                <p className="text-white/90 font-semibold text-sm flex items-center gap-2">
                  ORDER NOW
                  <ArrowRight className="w-4 h-4" />
                </p>
              </div>
              <div className="flex justify-end">
                <div className="bg-white text-orange-600 font-bold text-xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  $12
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Small Square (Chicken) - Spans 4 columns, 1 row */}
          <div 
            className="col-span-6 lg:col-span-4 rounded-3xl overflow-hidden relative h-72 group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=600&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-700/90 via-red-600/75 to-orange-600/60 group-hover:from-red-800/95 transition-all duration-500"></div>
            
            <div className="absolute inset-0 p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Crispy Wings
                </h3>
                <p className="text-white/90 font-semibold text-sm flex items-center gap-2">
                  ORDER NOW
                  <ArrowRight className="w-4 h-4" />
                </p>
              </div>
              <div className="flex justify-end">
                <div className="bg-white text-red-600 font-bold text-xl w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                  $11
                </div>
              </div>
            </div>
          </div>

          {/* Card 5 - Wide Rectangle (Pasta) - Spans 4 columns, 1 row */}
          <div 
            className="col-span-12 lg:col-span-4 rounded-3xl overflow-hidden relative h-72 group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-800/70 to-pink-700/60 group-hover:from-purple-950/95 transition-all duration-500"></div>
            
            <div className="absolute inset-0 p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                  NEW
                </span>
                <h3 className="text-3xl font-bold text-white mb-2">
                  Premium Pasta
                </h3>
                <p className="text-white/90 font-semibold flex items-center gap-2">
                  ORDER NOW
                  <ArrowRight className="w-5 h-5" />
                </p>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-white">
                  <p className="text-sm opacity-80">Starting from</p>
                  <p className="text-3xl font-bold">$13</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}