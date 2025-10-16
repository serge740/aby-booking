import React, { useState, useEffect } from "react";
import { FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    rating: 5,
    title: 'Coffee Enthusiast',
    emoji: '☕',
    text: 'Jambokawa has the most amazing coffee I have ever tasted! The atmosphere and service are absolutely perfect.',
    name: 'Sarah Johnson',
    date: '15 March 2025',
  },
  {
    rating: 4,
    title: 'Remote Worker',
    emoji: '💻',
    text: 'Great place to work from! Fast WiFi, comfortable seating, and delicious coffee that keeps me productive all day.',
    name: 'Michael Chen',
    date: '5 Feb 2025',
  },
  {
    rating: 5,
    title: 'Pastry Lover',
    emoji: '🥐',
    text: 'Their croissants are to die for! Paired with their signature Jambokawa blend, it is pure bliss every morning.',
    name: 'Emma Rodriguez',
    date: '28 Jan 2025',
  },
  {
    rating: 5,
    title: 'Regular Customer',
    emoji: '🌟',
    text: 'The baristas at Jambokawa remember my name and my usual order. It feels like home every time I visit.',
    name: 'David Kim',
    date: '10 March 2025',
  },
  {
    rating: 4,
    title: 'Coffee Connoisseur',
    emoji: '👃',
    text: 'Excellent single-origin beans and skilled brewing methods. One of the best specialty coffee shops in town.',
    name: 'Lisa Thompson',
    date: '3 Feb 2025',
  },
  {
    rating: 5,
    title: 'Student',
    emoji: '📚',
    text: 'My favorite study spot! The coffee is amazing and the quiet ambiance helps me focus for hours.',
    name: 'Alex Morgan',
    date: '18 Feb 2025',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(
    window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1
  );

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, itemsPerSlide]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerSlide) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - itemsPerSlide < 0 ? testimonials.length - itemsPerSlide : prevIndex - itemsPerSlide
    );
  };

  return (
    <section className="py-20 px-4 bg-[#6F4E37] text-gray-900 w-full mx-auto text-center relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Badge */}
        <div className="inline-block mb-4">
          <span className="text-[#8b7355] font-semibold text-sm uppercase tracking-wider bg-[#d8c9ad] px-4 py-2 rounded-full">
            Testimonials
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          What Our <span className="text-white ">Customers</span> Say
        </h2>
        <p className="text-white mb-12 text-lg max-w-2xl mx-auto">
          Hear from our happy customers about their Jambokawa Coffee experience.
        </p>

        {/* Testimonials Slider */}
        <div className="relative w-full mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)` }}
            >
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="w-full md:w-1/2 lg:w-1/3 px-4"
                  style={{ flex: `0 0 ${100 / itemsPerSlide}%` }}
                >
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#d8c9ad] h-full flex flex-col group">
                    {/* Quote Icon */}
                    <div className="flex justify-start mb-4">
                      <div className="bg-[#f5f0e6] p-3 rounded-full group-hover:bg-[#e8dfd0] transition-colors duration-300">
                        <FaQuoteRight className="text-[#6F4E37] text-xl" />
                      </div>
                    </div>

                    {/* Star Ratings */}
                    <div className="flex justify-start mb-4 text-[#d4af37]">
                      {[...Array(t.rating)].map((_, i) => (
                        <FaStar key={i} className="mr-1" />
                      ))}
                      {[...Array(5 - t.rating)].map((_, i) => (
                        <FaStar key={i} className="mr-1 text-gray-300" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 mb-6 text-left leading-relaxed flex-grow">
                      "{t.text}"
                    </p>

                    {/* Client Info */}
                    <div className="flex items-center justify-between pt-6 border-t border-[#e8dfd0]">
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-lg">{t.name}</p>
                        <p className="text-[#6F4E37] text-sm font-medium">
                          {t.title} {t.emoji}
                        </p>
                      </div>
                      <p className="text-gray-500 text-sm">{t.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-[#6F4E37] text-gray-700 hover:text-white p-4 rounded-full shadow-lg transition-all duration-300 border border-[#d8c9ad] hover:border-[#6F4E37]"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-lg" />
          </button>
          <button
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-[#6F4E37] text-gray-700 hover:text-white p-4 rounded-full shadow-lg transition-all duration-300 border border-[#d8c9ad] hover:border-[#6F4E37]"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-lg" />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#d8c9ad] rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#e8dfd0] rounded-full opacity-20 blur-xl"></div>
      </div>
    </section>
  );
}