import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import React from 'react';


const projects = [
  '../image/app.png',
  '../image/ap.png',
  '../image/mobille.png',
  '/path-to-image4.jpg',
  '/path-to-image5.jpg',
];

export default function LatestProjects() {
  return (
    <div className="bg-[#0c0f16] text-white py-10 px-5">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">
          My <span className="text-yellow-400">Latest</span>Projects
        </h2>
        <p className="text-gray-400 mt-2">This Is The Latest Project We Have Build.</p>
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        navigation
        modules={[Navigation]}
        breakpoints={{
          1024: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          640: { slidesPerView: 1 },
        }}
        className="w-full"
      >
        {projects.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="rounded-lg overflow-hidden">
              <img src={image} alt={`Project ${index + 1}`} className="w-full h-[200px] object-cover" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
