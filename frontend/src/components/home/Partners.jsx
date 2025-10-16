import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Using placeholder and free online logos
const basePartners = [
  { 
    name: "TechCorp", 
    logo: "https://via.placeholder.com/150x60/1a1a1a/c0aa83?text=TechCorp" 
  },
  { 
    name: "Innovation Labs", 
    logo: "https://via.placeholder.com/150x60/2c2c2c/c0aa83?text=InnoLabs" 
  },
  { 
    name: "Digital Solutions", 
    logo: "https://via.placeholder.com/150x60/1a1a1a/c0aa83?text=DigiSol" 
  },
  { 
    name: "Cloud Systems", 
    logo: "https://via.placeholder.com/150x60/2c2c2c/c0aa83?text=CloudSys" 
  },
  { 
    name: "Smart Tech", 
    logo: "https://via.placeholder.com/150x60/1a1a1a/c0aa83?text=SmartTech" 
  },
  { 
    name: "Future Co", 
    logo: "https://via.placeholder.com/150x60/2c2c2c/c0aa83?text=FutureCo" 
  },
];

// Duplicate to make 10 slides
const partners = Array(10)
  .fill(null)
  .map((_, i) => basePartners[i % basePartners.length]);

export default function Partners() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <section className="bg-[#1a1a1a] py-4 md:py-10 px-4 md:px-8">
      <div className="mx-auto w-[95%]">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20 text-white" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-[#6F4E37]">Partners</span>
          </h2>
          <p className="text-[#6F4E37] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Working together with trusted brands to bring value and innovation.
          </p>
        </div>

        {/* Partners Slider */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 5 },
            }}
            loop={true}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              el: ".swiper-pagination",
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            className="mySwiper"
          >
            {partners.map((p, index) => (
              <SwiperSlide key={index}>
                <div
                  className="flex items-center justify-center h-28 bg-white/5 rounded-lg p-4"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-20 w-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots */}
          <div className="swiper-pagination flex justify-center gap-2 mt-8 md:mt-12"></div>
        </div>
      </div>

      <style jsx>{`
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #6F4E37;
          opacity: 0.3;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          width: 30px;
          border-radius: 5px;
        }
      `}</style>
    </section>
  );
}