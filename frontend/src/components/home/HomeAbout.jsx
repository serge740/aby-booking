'use client';

import React from 'react';
import { Store, Users, Smartphone, MapPin, ArrowRight, Globe, Lightbulb, Handshake } from 'lucide-react';

export default function AbyBookingAbout() {
  return (
    <section className="w-full bg-gray-50 py-16 md:py-10 px-4 md:px-12">
      <div className="mx-auto ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ── LEFT: Image Grid ── */}
          <div className="relative">
            <div className="grid grid-cols-3 grid-rows-4 gap-4 h-full xl:h-[700px] ">
              {/* 1. Hero – App on phone */}
              <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=800&fit=crop"
                  alt="ABY DASH app on smartphone"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 2. Stats Card – Local Businesses */}
              <div className="col-span-1 row-span-2 bg-gradient-to-br from-primary-600 to-primary-500 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 hover:scale-[1.02] transition-transform duration-300">
                <Store className="w-12 h-12 text-white mb-3" />
                <h3 className="text-white text-4xl font-bold mb-1">Work </h3>
                <p className="text-white text-sm font-medium text-center">with Local Businesses</p>
              </div>

              {/* 3. Happy users */}
              <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070"
                  alt="Rwandans using ABY DASH"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 4. Mobile interface */}
              <div className="col-span-1 row-span-2 overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
                <img
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=800&fit=crop"
                  alt="ABY DASH mobile interface"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-400 rounded-full opacity-10 blur-2xl" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary-400 rounded-full opacity-10 blur-2xl" />
          </div>

          {/* ── RIGHT: Text Content ── */}
          <div className="text-gray-900 space-y-3">
            {/* Header */}
            <div>
              <p className="text-sm md:text-base font-light tracking-wider mb-3 text-primary-600 uppercase flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                About ABY DASH
              </p>
              <h2 className="text-3xl md:text-4xl  font-bold mb-6 leading-tight">
                Rwanda’s All-in-One Platform for{' '}
                <span className="text-primary-600">Local Discovery.</span>
              </h2>
            </div>

            {/* Body paragraphs */}
            <div className="space-y-5 text-gray-600">
              <p className="text-base md:text-lg leading-relaxed">
                Welcome to <strong>ABY DASH</strong> — Rwanda’s all-in-one platform that connects people to the best local businesses, services, and products. From delicious restaurant meals to convenient supermarket orders, ABY DASH makes it simple to discover, book, and enjoy what Kigali has to offer — all in one place.
              </p>

              <p className="text-base md:text-lg leading-relaxed flex items-start gap-2">
                <Globe className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Our Mission:</strong> To empower local businesses and make everyday life easier for Rwandans by creating a seamless digital bridge between customers and service providers.
                </span>
              </p>

              <p className="text-base md:text-lg leading-relaxed flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>What We Do:</strong> Restaurants, supermarkets, salons, and service providers showcase their offerings online. Customers browse, book, and order directly — fast, secure, and convenient.
                </span>
              </p>

              <p className="text-base md:text-lg leading-relaxed flex items-start gap-2">
                <Handshake className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Our Vision:</strong> To become Rwanda’s leading booking and service marketplace, driving digital transformation for local businesses while delivering a reliable, user-friendly experience.
                </span>
              </p>
            </div>

            {/* Feature Card */}
            <div className="flex items-start gap-4 bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop"
                    alt="ABY DASH app"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-primary-600 text-white text-xs font-bold rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
                  FREE
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary-600" />
                  Instant Booking & Delivery
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Book tables, order groceries, or schedule services in seconds — all from your phone.
                </p>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </section>
  );
}