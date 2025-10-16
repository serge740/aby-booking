import React from 'react';
import { Users, Shield, UserCheck } from 'lucide-react';
import Image from '../../assets/images/values.png'

function Values() {
  return (
    <div className=" bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 relative overflow-hidden px-10 py-2">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-6 py-4 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-800/50 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-600/30">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-100 font-medium">Our Value Proposition</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl lg:text-2xl xl:text-2xl font-bold text-white leading-tight">
              What's Make Us Different
            </h1>

            {/* Description */}
            <p className="text-blue-100 text-lg lg:text-xl leading-relaxed">
              We combine the best of African talent, modern, creative innovation, and proven processes to deliver exceptional talent solutions that drive business growth.
            </p>

            {/* Services */}
            <div className="space-y-6 pt-4">
              {/* BootCamp Training */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-600/30 group-hover:bg-blue-700/50 transition-colors">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">BootCamp Training</h3>
                  <p className="text-blue-200">A driving force for talent development</p>
                </div>
              </div>

              {/* Talent Outsourcing */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-600/30 group-hover:bg-blue-700/50 transition-colors">
                  <Shield className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Talent Outsourcing</h3>
                  <p className="text-blue-200">Career Launch & Job Placement</p>
                </div>
              </div>

              {/* Back-Office Operations */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-800/50 backdrop-blur-sm rounded-lg flex items-center justify-center border border-blue-600/30 group-hover:bg-blue-700/50 transition-colors">
                  <UserCheck className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="text-md font-bold text-white mb-1">Back-Office Operations.</h3>
                  <p className="text-blue-200">
                    Complete HR outsourcing including recruitment, payroll processing, and employee management.
                  </p>
                </div>
              </div>
            </div>

        
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white/10 backdrop-blur-sm">
              <img
                src={Image}
                alt="Professional team collaboration"
                className="w-full object-cover h-[500px]"
              />
              {/* Overlay icon in top-left */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-blue-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <div className="grid grid-cols-2 gap-1">
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Values;