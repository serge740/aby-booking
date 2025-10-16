import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

// Import partner logos
import abyride from "../../assets/images/abyride.png";
import rentbyaby from "../../assets/images/rentbyaby.png";
import abyinventory from "../../assets/images/abyinventory.png";
import image4 from '../../assets/partner/im4.png'
import image5 from '../../assets/partner/im5.png'
import image6 from '../../assets/partner/im5.jpg'



// Original partners (3)
const basePartners = [
  { name: "AbyRide", logo: abyride },
  { name: "Rent By Aby", logo: rentbyaby },
  { name: "Aby Inventory", logo: abyinventory },
    { name: "Aby Inventory", logo: image5 }, 
     { name: "Aby Inventory", logo: image6 }, 

      { name: "Aby Inventory", logo: image4 },
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
    <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 py-4 md:py-10 px-4 md:px-8">
      <div className="mx-auto w-[95%]">
        {/* Heading */}
        <div className="text-center mb-16 md:mb-20 text-white" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="text-blue-200">Partners</span>
          </h2>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
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
                  className="flex items-center justify-center h-28"
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="max-h-20 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination Dots */}
          <div className="swiper-pagination flex justify-center gap-2 mt-8 md:mt-12"></div>
        </div>
      </div>
    </section>
  );
}
