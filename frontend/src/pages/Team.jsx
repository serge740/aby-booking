import React, { useEffect } from "react";
import {
  Mail,
  MapPin,
  Star,
  Award,
  Users,
  Code,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";
import Header from "../components/header";
import Image1 from '../assets/mihi.jpg'
import Image2 from '../assets/honore.jpg'
import Image3 from '../assets/serge.jpg'
import Image4 from '../assets/sadiki.jpg'

const TeamMembersPage = () => {
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);

  const teamMembers = [
    {
      id: 1,
      name: "Sadiki Rukara",
      position: "C.E.O & FOUNDER",
      department: "Development",
      image: Image4,
      bio: "With 8+ years of expertise in full-stack development, leading our development initiatives and mentoring junior developers.",
      email: "rukara2095@gmail.com",
      phone: "+250 791 812 389",
      location: "United State Of America",
      joinDate: "March 2020",
      linkedin: "sarah-johnson",
      twitter: "sarahdev",
      github: "sarah-codes",
      skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
      rating: 4.9,
      projects: 23,
      certifications: ["AWS Solutions Architect", "React Specialist"],
    },
    {
      id: 2,
      name: "Mihigo Prince Jordan",
      position: "Senior Full Stack Software Developer",
      department: "Development",
      image: Image1,
      bio: "With 8+ years of expertise in full-stack development, leading our development initiatives and mentoring junior developers.",
      email: "mihigojordan8@gmail.com",
      phone: "+250 791 812 389",
      location: "Kigali, Rwanda",
      joinDate: "March 2020",
      linkedin: "sarah-johnson",
      twitter: "sarahdev",
      github: "sarah-codes",
      skills: ["React", "Node.js", "Python", "AWS", "MongoDB"],
      rating: 4.9,
      projects: 23,
      certifications: ["AWS Solutions Architect", "React Specialist"],
    },
    {
      id: 3,
      name: "Ishimwe Serge",
      position: "UI/UX Designer & Frontend Developer",
      department: "Design",
      image:Image3,
      bio: "Creative UI/UX designer with 6+ years of experience crafting user-centered digital experiences.",
      email: "ishiweserge07@gmail.com",
      phone: "+250 796 130 187",
      location: "Kigali, Rwanda",
      joinDate: "January 2021",
      linkedin: "michael-chen-design",
      twitter: "mikedesigns",
      github: "mike-ui",
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research", "HTML/CSS"],
      rating: 4.8,
      projects: 18,
      certifications: ["Google UX Design", "Adobe Certified Expert"],
    },
    {
      id: 4,
      name: "Hirwa Mihigo Honore",
      position: "DevOps & Backend Developer",
      department: "Backend",
      image:Image2,
      bio: "Skilled DevOps engineer ensuring applications run smoothly and scale efficiently across multiple environments.",
      email: "mihigohonore@gmail.com",
      phone: "+1 (555) 345-6789",
      location: "Kamonyi, Rwanda",
      joinDate: "September 2019",
      linkedin: "emily-rodriguez-devops",
      twitter: "emilyops",
      github: "emily-infra",
      skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
      rating: 4.9,
      projects: 31,
      certifications: ["AWS DevOps Professional", "Kubernetes Administrator"],
    },
  ];

  const TeamMemberCard = ({ member }) => (
    <div className="group relative bg-white rounded-3xl p-8 hover:transform hover:scale-105 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden">
      {/* Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative Top Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-200/40 via-blue-200/30 to-transparent rounded-bl-full"></div>
      
      {/* Profile Image & Basic Info */}
      <div className="relative text-center mb-6">
        <div className="relative mb-6 inline-block">
          {/* Gradient Ring */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-70 transition-opacity duration-500 scale-110"></div>
          
          <img
            src={member.image}
            alt={member.name}
            className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg group-hover:border-purple-300 transition-all duration-300 object-cover"
          />
          
          {/* Status Badge */}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-700 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
          {member.name}
        </h3>
        <p className="text-purple-600 font-semibold text-sm mb-1">
          {member.position}
        </p>
     
      </div>

      {/* Contact Info */}
      <div className="relative space-y-3 mb-6">
        <div className="flex items-center text-gray-700 text-sm bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-xl hover:shadow-md transition-all duration-300 group/item">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="text-xs">{member.location}</span>
        </div>
        
        <div className="flex items-center text-gray-700 text-sm bg-gradient-to-r from-purple-50 to-indigo-50 p-3 rounded-xl hover:shadow-md transition-all duration-300 group/item">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-300">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <span className="truncate text-xs">{member.email}</span>
        </div>
      </div>

   

      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 via-purple-200/20 to-transparent rounded-tr-full"></div>
    </div>
  );

  return (
    <div className="w-full flex flex-col pb-4 items-center gap-12 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 min-h-screen">
         <Header title={`Our Team`} path={`Our Team`} />

      {/* Hero Section */}
      <div className="text-center max-w-8xl mx-auto px-6 mt-0">
        <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full">
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Meet Our Team
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Our{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Exceptional Team
          </span>
        </h1>
        
        <p className="text-gray-700 text-lg leading-relaxed mb-2 max-w-3xl mx-auto">
          Discover the talented professionals who drive our success. Each member brings unique expertise, 
          creativity, and dedication to deliver outstanding results.
        </p>

      </div>

      {/* Team Grid */}
      <div className="w-full max-w-8xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembersPage;