import React from "react";
import { FaCode, FaProjectDiagram, FaServer, FaRocket, FaClipboardList, FaCheckCircle } from "react-icons/fa";
import Blog from '../assets/images/web.webp'

export default function WebDevelopmentSection() {
  return (
    <section className="bg-[#171B224D] text-white py-16 px-8 flex flex-col items-center justify-center   w-[100%]">
      <div className="max-w-6xl flex  flex-col-reverse md:flex-row items-center w-[95%]">
        
        {/* Left Section - Image Placeholder */}
      

        {/* Right Section - Text & Features */}
        <div className="w-full md:w-1/2 text-left mt-10 md:mt-0 md:mr-32">
          <h2 className="text-4xl font-bold leading-tight">
            Build <span className="text-yellow-400">Scalable & Robust</span> Web Applications.
          </h2>
          <p className="mt-4 text-gray-300 leading-relaxed">
            From idea to launch, we deliver high-performance web solutions tailored to your needs.
          </p>

          {/* Features List */}
          <ul className="mt-6 space-y-3 leading-tight">
            <li className="flex items-center ">
              <FaCode className="text-yellow-400 mr-3 text-xl" /> Clean & Maintainable Code.
            </li>
            <li className="flex items-center">
              <FaProjectDiagram className="text-yellow-400 mr-3 text-xl" /> Agile Development Process.
            </li>
            <li className="flex items-center">
              <FaServer className="text-yellow-400 mr-3 text-xl" /> Scalable Server Architecture.
            </li>
          </ul>


          {/* Statistics Section */}
          <div className="mt-8 flex space-x-10">
            <div className="text-center">
              <p className="text-yellow-400 text-3xl font-bold">200+</p>
              <p className="text-gray-400 text-sm">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-400 text-3xl font-bold">50+</p>
              <p className="text-gray-400 text-sm">Technologies Used</p>
            </div>
            <div className="text-center">
              <p className="text-yellow-400 text-3xl font-bold">99%</p>
              <p className="text-gray-400 text-sm">Client Satisfaction</p>
            </div>
          </div>

        </div>
        <div className="relative w-full md:w-1/2 flex justify-center">
          <div className="relative bg-gray-800 p-6 rounded-xl shadow-lg">
            <img 
              src={Blog} 
              alt="Web Development" 
              className="rounded-lg"
            />
          </div>
        </div>
      </div>


      {/* Additional Web Development Stages */}
      <div className="max-w-6xl mt-16 grid md:grid-cols-3 gap-8">
        
        {/* Planning */}
        <div className="flex items-start gap-4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <FaClipboardList className="text-blue-400 text-4xl" />
          <div>
            <h3 className="text-lg font-semibold">Planning & Strategy</h3>
            <p className="text-gray-400 text-base">
              We analyze your requirements and create a roadmap for development success.
            </p>
          </div>
        </div>

        {/* Development */}
        <div className="flex items-start gap-4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <FaCode className="text-blue-400 text-4xl" />
          <div>
            <h3 className="text-lg font-semibold">Development</h3>
            <p className="text-gray-400 text-base">
              Our expert developers build high-quality, scalable, and secure web applications.
            </p>
          </div>
        </div>

        {/* Deployment */}
        <div className="flex items-start gap-4 bg-gray-800 p-6 rounded-lg shadow-lg">
          <FaRocket className="text-blue-400 text-4xl" />
          <div>
            <h3 className="text-lg font-semibold">Deployment & Optimization</h3>
            <p className="text-gray-400 text-base">
              We ensure seamless deployment, performance optimization, and continuous improvements.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
