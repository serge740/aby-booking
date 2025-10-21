import React, { useState } from "react";
import { Utensils, Users, Award, Heart, MapPin, Clock, Leaf, Star, ChefHat, TrendingUp } from "lucide-react";
import MeetPeopleSection from '../../components/home/MeetPeopleSection';
export default function AbyAboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    {
      icon: <Award className="w-12 h-12 text-red-600" />,
      number: "12+",
      label: "Years",
      subtitle: "Culinary Excellence"
    },
    {
      icon: <Users className="w-12 h-12 text-orange-600" />,
      number: "30+",
      label: "Team Members",
      subtitle: "Expert chefs & staff"
    },
    {
      icon: <Utensils className="w-12 h-12 text-red-600" />,
      number: "100+",
      label: "Menu Items",
      subtitle: "Delicious dishes"
    },
    {
      icon: <Heart className="w-12 h-12 text-orange-600" />,
      number: "50k+",
      label: "Happy Customers",
      subtitle: "Served with love"
    }
  ];

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
      <div className="relative h-96 bg-gradient-to-r from-black via-gray-900 to-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=600&fit=crop)'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-orange-500 text-lg mb-4 font-semibold tracking-wider uppercase">Discover Our Story</p>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">About Us</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative -mt-20 px-4 md:px-12 pb-16 z-30">
        <div className=" max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-orange-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="relative text-center">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center group-hover:from-orange-200 group-hover:to-red-200 transition-colors">
                      {stat.icon}
                    </div>
                  </div>

                  <div className="text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>

                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {stat.label}
                  </div>

                  <div className="text-sm text-gray-600">
                    {stat.subtitle}
                  </div>
                </div>

                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section with Tabs */}
      <div className="px-4 md:px-16 py-10">
        <div className=" mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <p className="text-orange-600 text-base font-semibold uppercase tracking-wider">
                Our Journey
              </p>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              The <span className="text-red-600">Aby Story</span>
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
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200 shadow-md'
                }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'mission'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200 shadow-md'
                }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'values'
                ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200 shadow-md'
                }`}
            >
              Our Values
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-600/20 rounded-3xl blur-3xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={activeTab === 'story'
                    ? "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop"
                    : activeTab === 'mission'
                      ? "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
                      : "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop"
                  }
                  alt="Restaurant story"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            </div>

            <div className="space-y-6">
              {activeTab === 'story' && (
                <div className="animate-fade-in">
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    A Passion Born from <span className="text-red-600">Flavor</span>
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
                </div>
              )}

              {activeTab === 'mission' && (
                <div className="animate-fade-in">
                  <h3 className="text-4xl font-bold text-gray-900 mb-4">
                    Cooking a <span className="text-red-600">Better World</span>
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our mission goes beyond serving great food. We're committed to creating positive impact at every level—from the farmers who grow our ingredients to the customers who enjoy them.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <ChefHat className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Expert Culinary Team</h4>
                        <p className="text-gray-700">Our chefs bring years of experience and passion to every dish we create.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <Leaf className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Fresh Local Ingredients</h4>
                        <p className="text-gray-700">We partner with local farms for the freshest, highest quality produce.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                      <Heart className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
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
                    What We <span className="text-red-600">Stand For</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                      <div key={index} className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-orange-100 hover:border-orange-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg">
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


<MeetPeopleSection />
  

      {/* CTA Section */}
      <div className="px-4 md:px-12 py-16">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-red-600 via-red-500 to-orange-600 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <Utensils className="w-16 h-16 text-orange-200 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Visit Us Today
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the difference that passion, quality, and community make. We can't wait to serve you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-10 py-4 bg-white text-red-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
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