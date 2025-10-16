import React, { useRef, useEffect } from "react";
import { ArrowRight, Sparkles, Code, Zap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import banner1 from "../../assets/banners/banner-img1.png";
import banner2 from "../../assets/banners/banner-img3.png";
import banner3 from "../../assets/banners/main-pic1.png";

export default function HeroSection() {
  const swiperRef = useRef(null);

  const slides = [
    {
      tag: "SOFTWARE SOLUTIONS",
      title: (
        <>
          Empowering Innovation <br /> Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Technology</span>
        </>
      ),
      description: (
        <>
          Delivering cutting-edge software solutions that drive businesses forward. Innovating since <span className="text-purple-400 font-bold">2022</span>, we transform ideas into impactful digital products at Abytech Hub Ltd.
        </>
      ),
      buttonText: "Get in Touch",
      buttonPath: "/contact-us",
      image: banner1,
      icon: Sparkles,
    },
    {
      tag: "IT TRAINING & EDUCATION",
      title: (
        <>
          Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600">Local Talent</span> <br /> Through Education
        </>
      ),
      description:
        "Abytech Hub Ltd provides comprehensive coding workshops and digital skills programs to support innovation within Rwanda's growing tech ecosystem. Join our community of learners.",
      buttonText: "Learn More",
      buttonPath: "/services",
      image: banner2,
      icon: Code,
    },
    {
      tag: "WEB DEVELOPMENT",
      title: (
        <>
          Building Modern <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Responsive Applications</span>
        </>
      ),
      description:
        "Kigali-based experts at Abytech Hub Ltd specializing in web development using React, JavaScript, and cutting-edge frameworks to create high-impact digital solutions.",
      buttonText: "Explore Services",
      buttonPath: "/services",
      image: banner3,
      icon: Zap,
    },
  ];

  useEffect(() => {
    if (!swiperRef.current) return;
    const swiper = swiperRef.current.swiper;

    swiper.on("slideChangeTransitionStart", () => {
      document
        .querySelectorAll(".hero-animate")
        .forEach((el) => (el.style.animation = "none"));
      setTimeout(() => {
        document.querySelectorAll(".hero-animate").forEach((el) => {
          el.style.animation = "";
        });
      }, 10);
    });
  }, []);

  return (
    <div className="w-full min-h-screen relative overflow-hidden py-10">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 animate-gradientShift"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full h-screen relative z-10"
      >
        {slides.map((slide, index) => {
          const IconComponent = slide.icon;
          return (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-full px-4 md:px-8 py- ">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left Section */}
                  <div className="flex flex-col justify-center space-y-6 overflow-hidden relative">
                    {/* Decorative Side Line */}
                    <div className="hero-animate absolute left-0 top-0 w-1 h-32 bg-gradient-to-b from-purple-400 to-blue-500 opacity-0 animate-slideInLeft" style={{ animationDelay: "0.3s" }}></div>

                    <div className="space-y-4 relative pl-6">
                      {/* Icon Badge */}
                      <div
                        className="hero-animate inline-flex items-center gap-2 opacity-0 animate-slideInUp"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <h5 className="text-purple-300 letter-spacing-wide font-semibold text-sm md:text-base">
                          {slide.tag}
                        </h5>
                      </div>

                      {/* Animated Block Element */}
                      <div className="hero-animate absolute -left-4 top-20 w-20 h-20 border-2 border-blue-400 opacity-20 animate-rotateBlock" style={{ animationDelay: "0.5s" }}></div>

                      <h1
                        className="hero-animate text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight opacity-0 animate-slideInLeft"
                        style={{ animationDelay: "0.4s" }}
                      >
                        {slide.title}
                      </h1>

                      <p
                        className="hero-animate text-blue-100 text-base md:text-lg leading-relaxed max-w-md opacity-0 animate-slideInRight"
                        style={{ animationDelay: "0.6s" }}
                      >
                        {slide.description}
                      </p>
                    </div>

                    {/* CTA with Enhanced Animation */}
                    <div
                      className="hero-animate pl-6 opacity-0 animate-slideInUp"
                      style={{ animationDelay: "0.8s" }}
                    >
                      <Link to={slide.buttonPath}>
                        <button className="relative inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transition-all text-white font-semibold py-3 px-6 rounded-lg group overflow-hidden">
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
                          <span className="relative">{slide.buttonText}</span>
                          <ArrowRight className="relative w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>

     
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center justify-center h-full relative">
                    {/* Decorative Frame */}
                    <div className="hero-animate absolute inset-0 border-4 border-purple-500 opacity-20 rounded-2xl animate-pulse-slow" style={{ animationDelay: "0.7s" }}></div>
                    
                    {/* Floating Particles */}
                    <div className="hero-animate absolute top-10 right-10 w-3 h-3 bg-blue-400 rounded-full animate-float" style={{ animationDelay: "1.2s" }}></div>
                    <div className="hero-animate absolute bottom-20 left-10 w-2 h-2 bg-purple-400 rounded-full animate-float" style={{ animationDelay: "1.5s" }}></div>
                    <div className="hero-animate absolute top-1/2 right-20 w-2 h-2 bg-blue-300 rounded-full animate-float" style={{ animationDelay: "1.8s" }}></div>

                    <div className="relative">
                      <img
                        src={slide.image}
                        alt={slide.tag}
                        className="hero-animate w-full h-96 md:h-96 lg:h-[70vh] object-cover rounded-2xl shadow-2xl opacity-0 animate-scaleIn relative z-10"
                        style={{ animationDelay: "0.5s" }}
                      />
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-blue-600 opacity-20 rounded-2xl blur-2xl"></div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <style>{`
        /* Animations */
        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-80px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(80px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes rotateBlock {
          from { opacity: 0; transform: rotate(0deg); }
          to { opacity: 0.2; transform: rotate(45deg); }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.02); }
        }

        .animate-slideInUp { animation: slideInUp 0.8s ease forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.8s ease forwards; }
        .animate-slideInRight { animation: slideInRight 0.8s ease forwards; }
        .animate-scaleIn { animation: scaleIn 1s ease forwards; }
        .animate-fadeIn { animation: fadeIn 1s ease forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-rotateBlock { animation: rotateBlock 1s ease forwards; }
        .animate-gradientShift { 
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* Grid Pattern */
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Pagination styling */
        .swiper-pagination-bullet {
          background-color: rgba(147, 197, 253, 0.5) !important;
          width: 12px !important;
          height: 12px !important;
          opacity: 0.5 !important;
          border: 2px solid rgba(147, 197, 253, 0.3) !important;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: linear-gradient(135deg, #a855f7, #3b82f6) !important;
          border-color: rgba(168, 85, 247, 0.8) !important;
          transform: scale(1.2);
        }

        .letter-spacing-wide {
          letter-spacing: 2px;
        }
      `}</style>
    </div>
  );
}