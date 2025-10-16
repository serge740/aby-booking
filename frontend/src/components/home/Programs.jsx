import React, { useState } from 'react';
import { Code, Users, TrendingUp, Briefcase, ChevronDown } from 'lucide-react';

function Programs() {
  const [activeTab, setActiveTab] = useState('programs');
  const [openAccordion, setOpenAccordion] = useState(null);

  const programs = [
    {
      icon: <Code className="w-8 h-8" />,
      title: "IT Training",
      description: "Comprehensive technology training programs covering modern programming languages, cloud computing, and software development practices.",
      features: ["Web Development", "Cloud Architecture", "DevOps", "Cybersecurity"]
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Deal Management",
      description: "Strategic deal structuring and management training to help you close more deals and build lasting client relationships.",
      features: ["Sales Strategy", "Contract Negotiation", "Client Relations", "Pipeline Management"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Talent Development",
      description: "Invest in your team's growth with our comprehensive talent development programs designed to unlock potential.",
      features: ["Leadership Training", "Soft Skills", "Career Coaching", "Performance Management"]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Business Growth",
      description: "Scale your business with proven strategies and frameworks for sustainable growth and market expansion.",
      features: ["Market Analysis", "Growth Hacking", "Digital Marketing", "Business Strategy"]
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Discovery Call",
      content: "We begin with a comprehensive consultation to understand your organization's unique needs, challenges, and goals. Our team will assess your current capabilities and identify areas for growth."
    },
    {
      step: "2",
      title: "Custom Program Design",
      content: "Based on the discovery phase, we create a tailored training program that aligns with your objectives. We select the right mix of courses, methodologies, and timelines to ensure maximum impact."
    },
    {
      step: "3",
      title: "Implementation",
      content: "Our expert instructors deliver engaging, hands-on training sessions using real-world scenarios and projects. We provide both in-person and virtual learning options to fit your schedule."
    },
    {
      step: "4",
      title: "Ongoing Support",
      content: "Learning doesn't stop after the program. We offer continuous mentorship, resources, and follow-up sessions to ensure long-term success and skill retention."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#c0aa83' }}>
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-8xl mx-auto px-14 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Jambokawa Programs</h1>
          <p className="text-xl text-white/90">Brewing excellence in every training session</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-8xl mx-auto px-14 mt-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'programs'
                ? 'bg-white text-amber-900 shadow-lg'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            Our Programs
          </button>
          <button
            onClick={() => setActiveTab('howItWorks')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'howItWorks'
                ? 'bg-white text-amber-900 shadow-lg'
                : 'bg-black/20 text-white hover:bg-black/30'
            }`}
          >
            How It Works
          </button>
        </div>

        {/* Programs Tab Content */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
            {programs.map((program, index) => (
              <div
                key={index}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:bg-white/25 transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-white mb-4">{program.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{program.title}</h3>
                <p className="text-white/95 mb-6">{program.description}</p>
                <div className="space-y-2">
                  {program.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/95">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* How It Works Tab Content */}
        {activeTab === 'howItWorks' && (
          <div className="max-w-8xl mx-auto pb-12">
            <div className="space-y-4">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/20 backdrop-blur-md rounded-xl border border-white/30 overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white text-left">{item.title}</h3>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-white transition-transform ${
                        openAccordion === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openAccordion === index ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pl-24">
                      <p className="text-white/95 leading-relaxed">{item.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Programs;