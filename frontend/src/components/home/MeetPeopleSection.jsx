import React, { useState } from 'react';
import { Quote, Star } from 'lucide-react';

export default function AbyTeamSection() {
  const [activeCard, setActiveCard] = useState(null);

  const team = [
    {
      name: "Carlos Martinez",
      role: "Head Chef",
      description: "Master of culinary arts with 15 years of experience creating exceptional dishes.",
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=800&fit=crop',
      specialty: "Italian Cuisine",
      quote: "Cooking is an art, and every dish tells a story."
    },
    {
      name: "Isabella Chen",
      role: "Sous Chef",
      description: "Passionate about fresh ingredients and innovative flavor combinations.",
      image: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=600&h=800&fit=crop",
      specialty: "Asian Fusion",
      quote: "Food brings people together in beautiful ways."
    },
    {
      name: "Marcus Johnson",
      role: "Grill Master",
      description: "Expert in grilling perfection, specializing in steaks and BBQ delights.",
      image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=600&h=800&fit=crop",
      specialty: "Grilled Specialties",
      quote: "The perfect sear changes everything."
    },
    {
      name: "Sophia Rodriguez",
      role: "Pastry Chef",
      description: "Creating sweet masterpieces that delight both eyes and taste buds.",
      image: "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=600&h=800&fit=crop",
      specialty: "Desserts & Pastries",
      quote: "Life is short, eat dessert first!"
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black py-20 px-4 md:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-red-500/5 rounded-full blur-3xl"></div>
      
      {/* Floating food elements */}
      <div className="absolute top-10 right-20 w-20 h-20 opacity-10 animate-float">
        <div className="w-full h-full bg-orange-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-32 left-16 w-16 h-16 opacity-10 animate-float" style={{ animationDelay: '1s' }}>
        <div className="w-full h-full bg-red-400 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            <p className="text-orange-500 text-sm md:text-base font-semibold italic uppercase tracking-wider">
              Our Talented Team
            </p>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>
          <h2 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Chefs</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            The passionate culinary artists behind every memorable dish at Aby Booking
          </p>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
              className="group relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-orange-500/20"
            >
              {/* Image Container */}
              <div className="relative h-[500px] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/95"></div>
                
                {/* Specialty Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 rounded-full shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform duration-300">
                  <p className="text-white text-xs font-bold">{member.specialty}</p>
                </div>

                {/* Quote Icon - appears on hover */}
                <div className={`absolute top-4 left-4 transition-all duration-500 ${
                  activeCard === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                }`}>
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  {/* Role Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-3 border border-white/20">
                    <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      {member.role}
                    </span>
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-3xl font-bold mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {member.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-white/80 text-sm leading-relaxed mb-4">
                    {member.description}
                  </p>

                  {/* Quote - appears on hover */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    activeCard === index ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="pt-3 mt-3 border-t border-white/20">
                      <p className="text-orange-400 text-sm italic font-medium">
                        "{member.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Decorative line */}
                  <div className={`h-1 rounded-full transition-all duration-500 mt-4 ${
                    activeCard === index 
                      ? 'w-full bg-gradient-to-r from-orange-500 to-red-500' 
                      : 'w-12 bg-white/30'
                  }`}></div>
                </div>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                  activeCard === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-orange-600/20 via-transparent to-transparent"></div>
                </div>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">Want to join our culinary team?</p>
          <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            View Career Opportunities
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}