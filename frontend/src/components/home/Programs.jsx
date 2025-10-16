import React, { useState } from 'react';
import { Coffee, Cookie, Users, Wifi, ChevronDown } from 'lucide-react';

function Programs() {
  const [activeTab, setActiveTab] = useState('programs');
  const [openAccordion, setOpenAccordion] = useState(null);

  const programs = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Signature Blends",
      description: "Experience our carefully crafted coffee blends sourced from the finest beans across Africa and beyond, roasted to perfection.",
      features: ["Ethiopian Yirgacheffe", "Rwandan Bourbon", "Kenyan AA", "House Blend"]
    },
    {
      icon: <Cookie className="w-8 h-8" />,
      title: "Fresh Pastries",
      description: "Indulge in our daily selection of freshly baked pastries, cakes, and treats made with premium ingredients.",
      features: ["Croissants & Danishes", "Custom Cakes", "Local Mandazi", "Artisan Cookies"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Event Space",
      description: "Host your meetings, celebrations, or gatherings in our welcoming space designed for connection and collaboration.",
      features: ["Private Meetings", "Coffee Tastings", "Birthday Parties", "Corporate Events"]
    },
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Work & Relax",
      description: "Enjoy a productive day or unwind with friends in our comfortable space with high-speed WiFi and cozy seating.",
      features: ["Free High-Speed WiFi", "Power Outlets", "Quiet Zones", "Outdoor Seating"]
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Your Experience",
      content: "Browse our menu of premium coffee blends, fresh pastries, and specialty drinks. Whether you're grabbing a quick espresso or settling in for the afternoon, we have something perfect for every mood and moment."
    },
    {
      step: "2",
      title: "Place Your Order",
      content: "Order at our counter or through our mobile app for quick pickup. Our friendly baristas are always happy to recommend drinks based on your taste preferences and provide details about our coffee origins."
    },
    {
      step: "3",
      title: "Enjoy Your Space",
      content: "Find your perfect spot in our cozy café. Whether you need a quiet corner for work, a communal table for meetings, or our outdoor patio for fresh air, we've designed every area for comfort and productivity."
    },
    {
      step: "4",
      title: "Join Our Community",
      content: "Become a Jambo regular and enjoy member perks, exclusive tastings, and invitations to special events. Follow us on social media to stay updated on new blends, seasonal treats, and community gatherings."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#6F4E37' }}>
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-8xl mx-auto px-6 md:px-14 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">JamboKawa Coffee Shop</h1>
          <p className="text-xl text-white/90">Where every cup tells a story</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-8xl mx-auto px-6 md:px-14 mt-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'programs'
                ? 'bg-white text-amber-900 shadow-lg'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            What We Offer
          </button>
          <button
            onClick={() => setActiveTab('howItWorks')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'howItWorks'
                ? 'bg-white text-amber-900 shadow-lg'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            How It Works
          </button>
        </div>

        {/* Programs Tab Content */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:bg-white/25 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-white mb-4">{program.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{program.title}</h3>
                <p className="text-white/95 mb-6">{program.description}</p>
                <div className="space-y-2">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/95">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How It Works Tab Content */}
        {activeTab === 'howItWorks' && (
          <div className="max-w-7xl mx-auto pb-12">
            <div className="space-y-4">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white text-left">{item.title}</h3>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-white transition-transform ${
                        openAccordion === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordion === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pl-20 md:pl-24">
                      <p className="text-white/95 leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Programs;