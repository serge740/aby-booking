import React from 'react';
import { Star } from 'lucide-react';

const TestimonialCard = ({ name, image, text, rating, align }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'} mb-12`}>
      <div className="relative max-w-md w-full">
        {/* Arrow pointing to timeline */}
        <div className={`absolute top-12 ${align === 'right' ? '-left-3 -translate-x-1/2' : '-right-3 translate-x-1/2'} w-0 h-0 
          border-t-[18px] border-t-transparent 
          border-b-[18px] border-b-transparent 
          ${align === 'right' ? 'border-r-[24px] border-r-white' : 'border-l-[24px] border-l-white'}
          z-10`}></div>
        
        {/* Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
          {/* Header with image */}
          <div className="relative h-36 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=300&fit=crop" 
              alt="Restaurant Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60"></div>
            
            <div className="absolute top-4 left-6 flex items-center gap-3">
              <img 
                src={image} 
                alt={name}
                className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-lg"
              />
              <div>
                <h3 className="text-white font-bold text-xl">{name}</h3>
                <p className="text-white/90 text-sm italic">Happy Customer</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-gradient-to-br from-red-600 to-red-500 p-6">
            <div className="mb-4">
              <svg className="w-8 h-8 text-white/40" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
              </svg>
            </div>
            
            <p className="text-white text-base leading-relaxed mb-6">
              {text}
            </p>
            
            {/* Rating */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-2xl">{rating}</span>
                <span className="text-white/90 text-sm">Rating</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < fullStars
                        ? 'fill-yellow-300 text-yellow-300'
                        : i === fullStars && hasHalfStar
                        ? 'fill-yellow-300/50 text-yellow-300'
                        : 'fill-transparent text-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AbyTestimonials() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "The best burger I've ever had! The ingredients are so fresh and the flavors are incredible. The staff is friendly and the atmosphere is perfect for a family dinner.",
      rating: 4.9,
      align: "left",
    },
    {
      name: "Michael Chen",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "Aby Booking never disappoints. Their pizza is authentic and delicious, and the delivery is always on time. This is my go-to place for weekend meals with friends.",
      rating: 5.0,
      align: "right",
    },
    {
      name: "Emily Rodriguez",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "Amazing food quality and great service! The chicken wings are crispy perfection and the pasta carbonara is creamy heaven. Highly recommend to everyone!",
      rating: 4.8,
      align: "left",
    },
    {
      name: "David Thompson",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      text: "I've been coming here for months now and the consistency is outstanding. Every dish is prepared with care and passion. The garlic burger is a must-try!",
      rating: 4.9,
      align: "right",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
      
      {/* Header */}
      <section className="text-center py-12 px-4 relative z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          <p className="text-orange-500 text-sm md:text-base uppercase tracking-wider font-semibold">
            Reviews by Customers
          </p>
          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
        </div>
        <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide mb-4">
          Customer <span className="text-orange-500">Testimonials</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Hear what our satisfied customers have to say about their dining experience
        </p>
      </section>

      {/* Timeline Container */}
      <div className="max-w-6xl w-full mx-auto relative mt-12">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-red-500 to-orange-500 -translate-x-1/2 rounded-full shadow-lg shadow-orange-500/30"></div>
        
        {/* Timeline dots with glow */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          {testimonials.map((_, idx) => (
            <div 
              key={idx}
              className="absolute -translate-x-1/2 transition-all duration-300"
              style={{ top: `${idx * 25 + 8}%` }}
            >
              <div className="w-5 h-5 bg-orange-500 rounded-full shadow-lg shadow-orange-500/50 animate-pulse"></div>
              <div className="absolute inset-0 w-5 h-5 bg-orange-500 rounded-full animate-ping opacity-75"></div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="relative">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center mt-16">
        <button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-12 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
          Share Your Experience
        </button>
      </div>
    </div>
  );
}