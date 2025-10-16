import React, { useEffect } from "react";
import { Coffee, Users, Award, Heart } from "lucide-react";
import Header from "../../components/header";

const AboutUs = () => {
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);

  const stats = [
    {
      icon: <Award className="w-12 h-12 text-[#c0aa83]" />,
      number: "15+",
      label: "Years",
      subtitle: "Brewing Excellence"
    },
    {
      icon: <Users className="w-12 h-12 text-[#c0aa83]" />,
      number: "25+",
      label: "Baristas",
      subtitle: "Expert coffee makers"
    },
    {
      icon: <Coffee className="w-12 h-12 text-[#c0aa83]" />,
      number: "50+",
      label: "Coffee Varieties",
      subtitle: "From around the world"
    },
    {
      icon: <Heart className="w-12 h-12 text-[#c0aa83]" />,
      number: "10k+",
      label: "Happy Customers",
      subtitle: "Daily visitors"
    }
  ];

  return (
    <div className="w-full min-h-screen ">
      {/* Header Section */}
      <Header title={'About Us'} path={'about-us'} />

      <div className="relative pt-10 pb-4 px-12 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#c0aa83]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#c0aa83]/30 rounded-full blur-3xl"></div>

        <div className="relative mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side: Coffee Illustration */}
          <div className="flex-1">
            <div className="relative h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#c0aa83]/20 to-[#a38e6a]/20 rounded-3xl blur-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80" 
                alt="Coffee Shop" 
                className="relative w-full h-full object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>

          {/* Right Side: Text Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#c0aa83] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#a38e6a] rounded-full animate-pulse delay-100"></div>
                <div className="w-2 h-2 bg-[#8c7452] rounded-full animate-pulse delay-200"></div>
              </div>
              <span className="text-[#c0aa83] font-semibold uppercase tracking-wider text-sm">
                About Our Coffee Shop
              </span>
            </div>

            <h1 className="text-5xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Brewing Passion & Quality
              <br />
              <span className="bg-gradient-to-r from-[#c0aa83] via-[#a38e6a] to-[#8c7452] bg-clip-text text-transparent">
                Since Day One
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8">
              Where every cup tells a story of dedication, craftsmanship, and the finest beans from around the world.
            </p>

            {/* Stats Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
              <div className="flex items-center gap-4 p-4 bg-white/90 rounded-xl shadow-md hover:shadow-xl transition border border-[#c0aa83]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-full flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#c0aa83]">15+</p>
                  <p className="text-gray-600 text-sm">Years of Excellence</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/90 rounded-xl shadow-md hover:shadow-xl transition border border-[#c0aa83]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#c0aa83]">25+</p>
                  <p className="text-gray-600 text-sm">Expert Baristas</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/90 rounded-xl shadow-md hover:shadow-xl transition border border-[#c0aa83]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#c0aa83]">50+</p>
                  <p className="text-gray-600 text-sm">Coffee Varieties</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/90 rounded-xl shadow-md hover:shadow-xl transition border border-[#c0aa83]">
                <div className="w-16 h-16 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="font-bold text-2xl text-[#c0aa83]">10k+</p>
                  <p className="text-gray-600 text-sm">Happy Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative px-12 pb-20 p-10">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#c0aa83]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#c0aa83]/5 to-[#a38e6a]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  
                  <div className="text-4xl font-bold text-[#c0aa83] mb-2">
                    {stat.number}
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {stat.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative px-12 pb-20">
        <div className="mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Gallery Side */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#c0aa83]/20 to-[#a38e6a]/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-[#c0aa83]">
                <div className="space-y-6 h-[530px]">
                  {/* Main Image Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 rounded-2xl h-[300px] relative overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80" 
                        alt="Coffee brewing" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#c0aa83]/50 to-transparent"></div>
                    </div>
                    <div className="rounded-2xl h-[300px] overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80" 
                        alt="Coffee beans" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-2xl h-[230px] overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80" 
                        alt="Espresso machine" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="col-span-2 rounded-2xl h-[230px] overflow-hidden group relative">
                      <img 
                        src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80" 
                        alt="Cozy cafe interior" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#c0aa83]/40 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Crafting Coffee Excellence
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded with a passion for perfect coffee, we source the finest beans globally 
                  and roast them with precision to deliver an unforgettable experience in every cup.
                </p>
              </div>

              <div className="space-y-6">
                <div className="group flex gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-[#c0aa83]">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Coffee className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Quality Beans</h3>
                    <p className="text-gray-600">
                      We source only the finest Arabica and specialty beans from sustainable farms 
                      around the world, ensuring exceptional taste in every brew.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-[#c0aa83]">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Baristas</h3>
                    <p className="text-gray-600">
                      Our skilled team of coffee artisans brings years of experience and passion, 
                      crafting each drink with precision and care.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 p-6 bg-white/90 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-[#c0aa83]">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-[#c0aa83] to-[#a38e6a] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Award-Winning Roasts</h3>
                    <p className="text-gray-600">
                      Our carefully developed roasting techniques have earned recognition and numerous 
                      awards in the specialty coffee community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;