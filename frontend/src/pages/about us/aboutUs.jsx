import React, { useEffect } from "react";
import { TrendingUp, Users, Award, Target } from "lucide-react";
import Image from '../../assets/images/about-img1.png'
import Header from "../../components/header";
import Image1 from '../../assets/images/icon4.png'
import Image2 from '../../assets/images/icon5.png'
import Image3 from '../../assets/images/icon6.png'
import Image4 from '../../assets/images/icon7.png'

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
      icon: <Award className="w-12 h-12 text-blue-500" />,
      number: "3+",
      label: "Years",
      subtitle: "On the market"
    },
    {
      icon: <Users className="w-12 h-12 text-indigo-500" />,
      number: "10+",
      label: "Team members",
      subtitle: "Expert professionals"
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-purple-500" />,
      number: "98%",
      label: "Satisfaction rate",
      subtitle: "Happy clients"
    },
    {
      icon: <Target className="w-12 h-12 text-cyan-500" />,
      number: "20+",
      label: "Projects",
      subtitle: "Successfully delivered"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
       <Header title={`About Us `} path={`About Us`} />


<div className="relative pt-10 pb-4 px-4 overflow-hidden">
  {/* Decorative Elements */}
  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>

  <div className="relative max-w-8xl mx-auto flex flex-col lg:flex-row items-center gap-12">
    {/* Left Side: Illustration */}
    <div className="flex-1">
      <img 
        src={Image} 
        alt="Data Science Illustration" 
        className="w-full h-auto rounded-lg shadow-lg"
      />
    </div>

    {/* Right Side: Text Content */}
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-200"></div>
        </div>
        <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          About Us
        </span>
      </div>

      <h1 className="text-5xl md:text-4xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight">
        Drive Digital Revolution
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Through Data Science
        </span>
      </h1>

<p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-8">
  We create meaningful solutions that empower people and make technology more human and impactful.
</p>


{/* Stats Boxes */}
<div className="grid border w-[300%]  grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition w-[330px] h-[120px]">
    <div>
      <img src={Image1} alt="Years Icon" className="w-24 h-16" />
    </div>
    <div>
      <p className="font-bold text-lg text-black">4 Years</p>
      <p className="text-gray-500 text-sm">On the market</p>
    </div>
  </div>

  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition w-[330px] ml-36 ">
    <div>
      <img src={Image2} alt="Team Icon" className="w-24 h-16" />
    </div>
    <div>
      <p className="font-bold text-lg text-black">10+</p>
      <p className="text-gray-500 text-sm">Team members</p>
    </div>
  </div>

  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition w-[330px]">
    <div>
      <img src={Image3} alt="Satisfaction Icon" className="w-24 h-16" />
    </div>
    <div>
      <p className="font-bold text-lg text-black">80%</p>
      <p className="text-gray-500 text-sm">Satisfaction rate</p>
    </div>
  </div>

  <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-lg transition w-[330px] h-[120px] ml-36">
    <div>
      <img src={Image4} alt="Scientist Icon" className="w-24 h-16" />
    </div>
    <div>
      <p className="font-bold text-lg text-black">70%</p>
      <p className="text-gray-500 text-sm">Senior scientist</p>
    </div>
  </div>
</div>

  
    </div>
  </div>
</div>



      

      {/* Stats Section */}
      <div className="relative px-4 pb-20 p-10">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  
                  <div className="text-4xl font-bold text-gray-900 mb-2">
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
      <div className="relative px-4 pb-20">
        <div className="max-w-8xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Illustration Side */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="space-y-6 h-[530px]">
                  {/* Main Image Grid */}
                  <div className="grid grid-cols-3 gap-4 ">
                    <div className="col-span-2 rounded-2xl h-[300px] relative overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80" 
                        alt="City transportation" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent "></div>
                    </div>
                    <div className="rounded-2xl h-[300px] overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1543076659-9380cdf10613?w=400&q=80" 
                        alt="Modern car" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-2xl h-[230px] overflow-hidden group">
                      <img 
                        src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400&q=80" 
                        alt="Mobile app" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="col-span-2 rounded-2xl h-[230px] overflow-hidden group relative">
                      <img 
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" 
                        alt="Team collaboration" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 to-transparent"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Transforming Transportation
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded with a vision to revolutionize urban mobility, Abyride combines 
                  advanced technology with user-centric design to deliver exceptional ride-sharing experiences.
                </p>
              </div>

              <div className="space-y-6">
                <div className="group flex gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation-Driven</h3>
                    <p className="text-gray-600">
                      Leveraging cutting-edge technology and data science to optimize routes, 
                      reduce wait times, and enhance safety for every journey.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Community-Focused</h3>
                    <p className="text-gray-600">
                      Building a trusted platform that connects drivers and riders, fostering 
                      a community built on reliability, safety, and mutual respect.
                    </p>
                  </div>
                </div>

                <div className="group flex gap-4 p-6 bg-white/80 backdrop-blur-sm rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Results-Oriented</h3>
                    <p className="text-gray-600">
                      Committed to delivering measurable impact through efficient operations, 
                      sustainable practices, and continuous improvement.
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