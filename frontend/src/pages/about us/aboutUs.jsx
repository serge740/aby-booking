import React, { useState } from "react";
import { Utensils, Users, Award, Heart, MapPin, Clock, Leaf, Star, ChefHat, TrendingUp, Smartphone, ArrowRight, Globe, Rocket, TestTube2, Code, Puzzle, Lightbulb } from "lucide-react";
import MeetPeopleSection from '../../components/home/MeetPeopleSection';
import Header from "../../components/header";
export default function AbyAboutPage() {
  const [activeTab, setActiveTab] = useState('story');


  const values = [
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Quality First",
      description: "We use only the freshest ingredients and authentic recipes in every dish."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainability",
      description: "Committed to locally sourced ingredients and eco-friendly practices."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community",
      description: "Creating memorable dining experiences and bringing people together."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly crafting new flavors while honoring traditional recipes."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
    <Header  path={'Story'} title={'About Us'} />

      {/* Stats Section */}
  

      {/* Story Section with Tabs */}
      <div className="px-4 md:px-11 py-10">
        <div className=" mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-red-600 text-base font-semibold uppercase tracking-wider">
                Our Journey
              </p>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              The <span className="text-primary-600">Aby Story</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes us different and why food lovers choose us
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'story'
                ? 'bg-gradient-to-r from-primary-600 to-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200 shadow-md'
                }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'mission'
                ? 'bg-gradient-to-r from-primary-600 to-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200 shadow-md'
                }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'values'
                ? 'bg-gradient-to-r from-primary-600 to-red-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-red-50 border-2 border-red-200 shadow-md'
                }`}
            >
              Our Values
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-primary-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={activeTab === 'story'
                    ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                    : activeTab === 'mission'
                      ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
                      : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop"
                  }
                  alt="Restaurant story"
                  className="w-full h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-6">
              {activeTab === 'story' && (
                <div className="animate-fade-in">
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    A Passion Born from <span className="text-primary-600">Flavor</span>
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    It all started in 2013 with a simple dream: to create a place where food isn't just a meal, but an unforgettable experience. Our founder, inspired by travels through culinary capitals of Italy, France, and Asia, returned with a vision to bring authentic, exceptional flavors to our community.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    What began as a small family kitchen has grown into a beloved dining destination, where every dish is crafted with love and every guest becomes part of our extended family. We've stayed true to our roots while continuously evolving our menu.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Today, we're proud to serve over 50,000 happy customers who trust us for their celebrations, family dinners, and everything in between.
                  </p>
                  
                  
              
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
         

            {/* CTA */}
            <div className="pt-4">
              <button className="group inline-flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-primary-600 text-primary-600 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300 font-medium text-base">
                Explore Businesses
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

                </div>
              )}

              {activeTab === 'mission' && (
                <div className="animate-fade-in">
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    Cooking a <span className="text-primary-600">Better World</span>
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our mission goes beyond serving great food. We're committed to creating positive impact at every level—from the farmers who grow our ingredients to the customers who enjoy them.
                  </p>
                      <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    It all started in 2013 with a simple dream</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-primary-50 rounded-2xl border border-red-100">
                      <ChefHat className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Expert Culinary Team</h4>
                        <p className="text-gray-700">Our chefs bring years of experience and passion to every dish we create.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-primary-50 rounded-2xl border border-red-100">
                      <Leaf className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Fresh Local Ingredients</h4>
                        <p className="text-gray-700">We partner with local farms for the freshest, highest quality produce.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-primary-50 rounded-2xl border border-red-100">
                      <Heart className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Community First</h4>
                        <p className="text-gray-700">Supporting local initiatives and creating memorable dining experiences.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="animate-fade-in">
                  <h3 className="text-4xl font-bold text-gray-900 mb-6">
                    What We <span className="text-primary-600">Stand For</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {values.map((value, index) => (
                      <div key={index} className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-red-100 hover:border-red-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-red-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          {value.icon}
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h4>
                        <p className="text-gray-700">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

            {/* Why Choose Us Section */}
      <div className="px-4 md:px-11 py-16 bg-gradient-to-b from-white to-red-50">
        <div className=" mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <p className="text-red-600 text-base font-semibold uppercase tracking-wider">
                Why Thousands Trust Us
              </p>
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-600">ABY DASH</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              More than just an app — we’re your daily partner for convenience, trust, and supporting local growth in Rwanda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. All-in-One Platform */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-primary-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">All-in-One Platform</h3>
              <p className="text-gray-600">
                Discover, book, and order everything — from restaurant meals to salon services and supermarket essentials — all in one easy app.
              </p>
            </div>

            {/* 2. Local & Secure Payments */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <div className="text-2xl font-bold">RWF</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Local & Secure Payments</h3>
              <p className="text-gray-600">
                We’re built for Rwanda! Pay safely through MTN Mobile Money, Airtel Money, or other trusted local options — no stress, no delay.
              </p>
            </div>

            {/* 3. Find Services Near You */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Find Services Near You</h3>
              <p className="text-gray-600">
                Use our smart location-based search to explore verified businesses in Kigali and nearby areas. Get what you need faster, closer, and easier.
              </p>
            </div>

            {/* 4. Empowering Local Businesses */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Empowering Local Businesses</h3>
              <p className="text-gray-600">
                We help Rwandan businesses grow by giving them an online presence, more visibility, and digital tools to manage bookings and customers.
              </p>
            </div>

            {/* 5. Trusted & Verified Providers */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-red-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Trusted & Verified Providers</h3>
              <p className="text-gray-600">
                Every business on ABY DASH is verified to ensure quality, trust, and reliability for all our users.
              </p>
            </div>

            {/* 6. Fast, Simple, and Reliable */}
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-1">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-primary-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fast, Simple, and Reliable</h3>
              <p className="text-gray-600">
                Book or order in just a few taps — quick, convenient, and always available when you need it.
              </p>
            </div>

            {/* 7. Customer-Centered Experience - Full Width */}
       
          </div>

          {/* CTA Below */}
        
        </div>
      </div>
 


      {/* CTA Section */}
      <div className="px-4 md:px-12 py-16">
        <div className=" mx-auto bg-gradient-to-r from-primary-600 via-primary-500 to-red-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <Utensils className="w-16 h-16 text-red-200 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Visit Us Today
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the difference that passion, quality, and community make. We can't wait to serve you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-primary-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Find Our Location
              </button>
              <button className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
                View Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}