import React, { useState, useEffect } from "react";
import { FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    rating: 5,
    title: 'Software Engineer',
    emoji: '🚀',
    text: 'AbyTech has been a game-changer for my career. Their mentorship and resources helped me scale my skills to new heights!',
    name: 'Nsanzimana Fabrice',
    date: '15 March 2025',
  },
  {
    rating: 4,
    title: 'IT Manager',
    emoji: '💡',
    text: 'Working with AbyTech was an eye-opening experience. Their expertise and professional approach to IT solutions impressed me greatly.',
    name: 'Nkaka Jean Doumour',
    date: '5 Feb 2025',
  },
  {
    rating: 5,
    title: 'Data Analyst',
    emoji: '📊',
    text: 'AbyTech provided powerful tools and insights that helped optimize our data processing. Highly recommend their services!',
    name: 'Mihigo Guillaume',
    date: '28 Jan 2025',
  },
  {
    rating: 5,
    title: 'Full Stack Developer',
    emoji: '💻',
    text: 'AbyTech transformed my approach to web and backend development. Their hands-on guidance was invaluable.',
    name: 'Habineza Patrick',
    date: '10 March 2025',
  },
  {
    rating: 4,
    title: 'Cloud Engineer',
    emoji: '☁️',
    text: 'Their cloud solutions are top-notch! AbyTech helped us implement secure and scalable architectures.',
    name: 'Rugamba Eric',
    date: '3 Feb 2025',
  },
  {
    rating: 5,
    title: 'UX/UI Designer',
    emoji: '🎨',
    text: 'Amazing experience! The design team at AbyTech has a keen eye for user experience and creativity.',
    name: 'Umutoni Grace',
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
    <section className="py-20 px-4 bg-gradient-to-b from-white to-primary-50 text-gray-900 w-full mx-auto text-center relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Badge */}
        <div className="inline-block mb-4">
          <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider bg-primary-50 px-4 py-2 rounded-full">
            Testimonials
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          What Our <span className="text-primary-600">Clients</span> Say
        </h2>
        <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
          Different customers sharing their experience with AbyTech.
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
                  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-primary-100 h-full flex flex-col group">
                    {/* Quote Icon */}
                    <div className="flex justify-start mb-4">
                      <div className="bg-primary-50 p-3 rounded-full group-hover:bg-primary-100 transition-colors duration-300">
                        <FaQuoteRight className="text-primary-600 text-xl" />
                      </div>
                    </div>

                    {/* Star Ratings */}
                    <div className="flex justify-start mb-4 text-secondary-500">
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
                    <div className="flex items-center justify-between pt-6 border-t border-primary-100">
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-lg">{t.name}</p>
                        <p className="text-primary-600 text-sm font-medium">
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
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary-600 text-gray-700 hover:text-white p-4 rounded-full shadow-lg transition-all duration-300 border border-primary-200 hover:border-primary-600"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="text-lg" />
          </button>
          <button
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary-600 text-gray-700 hover:text-white p-4 rounded-full shadow-lg transition-all duration-300 border border-primary-200 hover:border-primary-600"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <FaChevronRight className="text-lg" />
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary-100 rounded-full opacity-20 blur-xl"></div>
      </div>
    </section>
  );
}