import React from 'react';
import { Star } from 'lucide-react';
import Header from '../components/header';

const TestimonialCard = ({ name, image, text, rating, align }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className="relative max-w-md w-full">
        {/* Arrow */}
        <div className={`absolute top-8 ${align === 'right' ? '-left-2 -translate-x-1/2' : '-right-2 translate-x-1/2'} w-0 h-0 
          border-t-[15px] border-t-transparent 
          border-b-[15px] border-b-transparent 
          ${align === 'right' ? 'border-r-[20px] border-r-white' : 'border-l-[20px] border-l-white'}
          z-10`}></div>
        
        {/* Card */}
        <div className="bg-white border-4 border-white rounded-3xl overflow-hidden shadow-lg">
          {/* Header with image */}
          <div className="relative h-32 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1620807773206-49c1f2957417?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZmZlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=500" 
              alt="Background"
              className="w-full h-full object-cover backdrop-brightness-75"
            />
            <div className="absolute top-4 left-6 flex items-center gap-3">
              <img 
                src={image} 
                alt={name}
                className="w-14 h-14 rounded-full border-4 border-white object-cover"
              />
              <div>
                <h3 className="text-white font-semibold text-lg">{name}</h3>
                <p className="text-white/90 text-sm italic">Customer</p>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-primary-700 p-6">
            <p className="text-white/90 text-sm leading-relaxed mb-6 italic">
              {text}
            </p>
            
            {/* Rating */}
            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-lg">{rating}</span>
                <span className="text-white/90 text-sm">Rating</span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < fullStars
                        ? 'fill-white text-white'
                        : i === fullStars && hasHalfStar
                        ? 'fill-white/50 text-white'
                        : 'fill-transparent text-white'
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

export default function ReviewsTimeLine() {
  const testimonials = [
    {
      name: "Sandra",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "The cappuccino here is absolutely perfect — smooth foam and rich flavor. The barista even remembered my name after just two visits!",
      rating: 4.8,
      align: "left",
    },
    {
      name: "Don",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "This place has the coziest vibe in town. I always grab my morning espresso here before work — it tastes fresh and authentic every single time.",
      rating: 4.7,
      align: "right",
    },
    {
      name: "Olivia",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "Their cold brew is a game changer! It's smooth, not bitter, and pairs perfectly with a croissant. My go-to coffee spot for studying or relaxing.",
      rating: 5,
      align: "left",
    },
    {
      name: "Marcus",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      text: "I've been to many coffee shops, but this one stands out. The latte art is incredible and the atmosphere is perfect for remote work. Free WiFi is a huge plus!",
      rating: 4.9,
      align: "right",
    },
    {
      name: "Emily",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
      text: "Best flat white in the city! The beans are always fresh, and you can really taste the quality. The pastries are also homemade and delicious.",
      rating: 5,
      align: "left",
    },
    {
      name: "James",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
      text: "Love bringing my laptop here on weekends. The staff is friendly, the music is at just the right volume, and their iced americano never disappoints.",
      rating: 4.6,
      align: "right",
    },
    {
      name: "Rachel",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
      text: "A hidden gem! The caramel macchiato is my favorite, and I appreciate how they use sustainable cups. Great place to meet friends or just unwind.",
      rating: 4.8,
      align: "left",
    },
    {
      name: "David",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      text: "The pour-over coffee here is exceptional. You can tell the baristas are passionate about what they do. It's become my Sunday morning ritual.",
      rating: 5,
      align: "right",
    },
  ];

  return (
    <div className="min-h-screen bg-primary-900 flex flex-col items-center justify-center">
        <Header path={'Reviews'} title={'Reviews'} />
      <section className="text-center py-16 px-4">
        <p className="text-white text-sm md:text-base opacity-90 mb-2">
          Reviews by Customers
        </p>
        <h2 className="text-white text-3xl md:text-5xl font-semibold tracking-wide">
          Testimonials
        </h2>
      </section>
      
      <div className="max-w-5xl  w-full relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 -translate-x-1/2"></div>
        
        {/* Timeline dots */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2">
          {testimonials.map((_, idx) => (
            <div 
              key={idx}
              className="absolute w-3 h-3 bg-white rounded-full -translate-x-1/2"
              style={{ top: `${idx * 12.5 + 3}%` }}
            ></div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="relative">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard key={idx} {...testimonial} />
          ))}
        </div>
      </div>
      <section className="text-center py-16 px-4">
        <h2 className="text-white text-2xl md:text-3xl font-semibold mb-4">
          Ready to Experience It Yourself?
        </h2>
        <p className="text-amber-100 text-lg mb-8">
          Visit us today and discover your new favorite coffee spot!
        </p>
        <button className="bg-white text-amber-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-amber-50 transition-colors shadow-lg">
          Find Our Location
        </button>
      </section>
    </div>
  );
}