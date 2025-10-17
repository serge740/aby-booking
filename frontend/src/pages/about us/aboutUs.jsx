import React, { useState } from "react";
import { Coffee, Users, Award, Heart, MapPin, Clock, Leaf, Star } from "lucide-react";
import Header from "../../components/header";
import MeetPeopleSection from "../../components/home/MeetPeopleSection";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState('story');

  const stats = [
    {
      icon: <Award className="w-12 h-12 text-primary-700" />,
      number: "15+",
      label: "Years",
      subtitle: "Brewing Excellence"
    },
    {
      icon: <Users className="w-12 h-12 text-primary-700" />,
      number: "25+",
      label: "Baristas",
      subtitle: "Expert coffee makers"
    },
    {
      icon: <Coffee className="w-12 h-12 text-primary-700" />,
      number: "50+",
      label: "Coffee Varieties",
      subtitle: "From around the world"
    },
    {
      icon: <Heart className="w-12 h-12 text-primary-700" />,
      number: "10k+",
      label: "Happy Customers",
      subtitle: "Daily visitors"
    }
  ];

  const values = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Quality First",
      description: "We never compromise on the quality of our beans or brewing methods."
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainability",
      description: "Committed to ethical sourcing and environmental responsibility."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community",
      description: "Building connections one cup at a time in our welcoming space."
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Innovation",
      description: "Constantly exploring new flavors and brewing techniques."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <Header path={'About Us'} title={'About Us'} />

      {/* Stats Section */}
      <div className="relative -mt-20 px-4 md:px-12 pb-16 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-primary-200"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative text-center">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                    {stat.icon}
                  </div>

                  <div className="text-5xl font-bold text-primary-700 mb-2">
                    {stat.number}
                  </div>

                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {stat.label}
                  </div>

                  <div className="text-sm text-gray-600">
                    {stat.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section with Tabs */}
      <div className="px-4 md:px-12 py-20">
        <div className=" mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-primary-700">Journey</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover what makes us different and why coffee lovers choose us
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <button
              onClick={() => setActiveTab('story')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'story'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-primary-50 border-2 border-primary-200'
                }`}
            >
              Our Story
            </button>
            <button
              onClick={() => setActiveTab('mission')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'mission'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-primary-50 border-2 border-primary-200'
                }`}
            >
              Our Mission
            </button>
            <button
              onClick={() => setActiveTab('values')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === 'values'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-primary-50 border-2 border-primary-200'
                }`}
            >
              Our Values
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400/20 to-primary-600/20 rounded-3xl blur-2xl"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src={activeTab === 'story'
                    ? "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80"
                    : activeTab === 'mission'
                      ? "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80"
                      : "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80"
                  }
                  alt="Coffee story"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              {activeTab === 'story' && (
                <div className="animate-fade-in">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    A Passion Born from Love
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    It all started in 2009 with a simple dream: to create a space where coffee isn't just a beverage, but an experience. Our founder, inspired by travels through coffee-growing regions of Ethiopia, Colombia, and Indonesia, returned with a vision to bring authentic, exceptional coffee to our community.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    What began as a small corner shop has grown into a beloved gathering place, where every cup is crafted with care and every customer becomes part of our extended family. We've stayed true to our roots while continuously evolving our craft.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Today, we're proud to serve over 10,000 happy customers who trust us for their daily coffee ritual, special moments, and everything in between.
                  </p>
                </div>
              )}

              {activeTab === 'mission' && (
                <div className="animate-fade-in">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Brewing a Better World
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Our mission goes beyond serving great coffee. We're committed to creating positive impact at every level—from the farmers who grow our beans to the customers who enjoy them.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                      <MapPin className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Direct Trade Partnerships</h4>
                        <p className="text-gray-700">We work directly with coffee farmers, ensuring fair wages and sustainable practices.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                      <Leaf className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Environmental Stewardship</h4>
                        <p className="text-gray-700">From compostable cups to energy-efficient equipment, sustainability is at our core.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-primary-50 rounded-xl">
                      <Heart className="w-6 h-6 text-primary-700 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Community First</h4>
                        <p className="text-gray-700">Supporting local initiatives and creating a welcoming space for all.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'values' && (
                <div className="animate-fade-in">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    What We Stand For
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {values.map((value, index) => (
                      <div key={index} className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 border-primary-100 hover:border-primary-300">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
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
      <div className="px-4 md:px-5 py-5">
        <div className=" mx-auto bg-gradient-to-r from-primary-700 to-primary-900 rounded-3xl p-12 text-center shadow-2xl">
          <Coffee className="w-16 h-16 text-primary-200 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Visit Us Today
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Experience the difference that passion, quality, and community make. We can't wait to serve you!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary-900 rounded-full font-semibold text-lg hover:bg-primary-50 transition-all duration-300 shadow-lg hover:shadow-xl">
              Find Our Location
            </button>
            <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300">
              View Menu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;