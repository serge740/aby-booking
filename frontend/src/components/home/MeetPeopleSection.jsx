import React from 'react';

export default function MeetPeopleSection() {
const team = [
    {
      name: "Steve Walker",
      role: "Founder & Head Barista",
      description: "Bringing passion and perfection to every roast.",
      image: 'https://images.unsplash.com/photo-1599549211246-7065b775aa7b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGNvZmZlJTIwc2hvcCUyMHdvcmtlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500',
    },
    {
      name: "Sandra Miller",
      role: "Store Manager",
      description: "Keeping our shop warm, friendly, and organized.",
      image:
        "https://images.unsplash.com/photo-1618247591252-a40b656fccfb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fGNvZmZlJTIwc2hvcCUyMGVtcGxveWVlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    },
    {
      name: "Jackson Lee",
      role: "Senior Roaster",
      description: "Expert in crafting bold and balanced coffee blends.",
      image:
        "https://images.unsplash.com/photo-1736813133664-f1e450b43a19?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmUlMjBzaG9wJTIwZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    },
    {
      name: "Michelle Brown",
      role: "Lead Barista",
      description: "Creating smooth brews and latte art that wows.",
      image:
        "https://images.unsplash.com/photo-1580644043501-627f569f7e25?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29mZmUlMjBzaG9wJTIwd29ya2VyfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    },
  ];
  return (
    <div className=" bg-primary-700 py-16 px-4 md:px-8">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-white/80 text-sm md:text-base font-light italic mb-3">
            Creative Baristas
          </p>
          <h2 className="text-white text-5xl md:text-6xl font-bold">
            Meet People
          </h2>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative rounded-3xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
            >
              {/* Image Container */}
              <div className="relative h-[60vh] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent  to-primary-700/90"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {/* Name and Role */}
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      {member.name}
                    </h3>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                      {member.role}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-white/90 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}