import React, { useEffect, useState } from "react";
import { ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../../components/header";
import ride from "../../assets/images/project/ride2.png";
import chat from "../../assets/images/project/chat2.png";
import rent from "../../assets/images/project/rent2.png";
import inventory from "../../assets/images/project/inventory2.png";
import frexi from "../../assets/images/project/frex2.png";
import kalinga from "../../assets/images/project/kalinga2.png";
import abyhr from "../../assets/images/project/abyhr2.png";

// Projects data
const projects = [
  {
    id: 1,
    title: "Abyride",
    imageUrl: ride,
    description:
      "A platform connecting users with reliable and affordable ride services.",
    techStack: [
      "React.js",
      "Vite",
      "Socket.io",
      "Node.js",
      "NestJS",
      "TailwindCSS",
      "MySQL",
      "Prisma",
    ],
    liveDemo: "https://abyride.com/",
  },
  {
    id: 2,
    title: "Aby Inventory System",
    imageUrl: inventory,
    description:
      "Helps businesses manage stock and user permissions smoothly, online or offline.",
    techStack: [
      "React.js",
      "Vite PWA",
      "Vite",
      "TailwindCSS",
      "NestJS",
      "MySQL",
      "Prisma",
    ],
    liveDemo: "https://abyinventory.com/",
  },
  {
    id: 3,
    title: "Hi Chat",
    imageUrl: chat,
    description:
      "Fast, real-time messaging platform for texts and file sharing across devices.",
    techStack: [
      "React.js",
      "Socket.io",
      "TailwindCSS",
      "Vite",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Cloudinary",
    ],
    liveDemo: "https://chatapppz.netlify.app/",
  },
  {
    id: 4,
    title: "Rent By Aby",
    imageUrl: rent,
    description:
      "Platform connecting renters and property owners for easy booking and management.",
    techStack: [
      "React.js",
      "Vite",
      "Node.js",
      "NestJS",
      "TailwindCSS",
      "MySQL",
      "Prisma",
      "Lucide-react",
    ],
    liveDemo: "https://rentbyaby.com",
  },
  {
    id: 5,
    title: "frexi",
    imageUrl: frexi,
    description:
      "Frexi Travel & Tours is a dynamic platform connecting travelers with the breathtaking beauty, diverse wildlife, and rich cultural heritage of East Africa.",
    techStack: [
      "React.js",
      "Vite",
      "Node.js",
      "NestJS",
      "TailwindCSS",
      "MySQL",
      "Prisma",
      "Lucide-react",
    ],
    liveDemo: "https://frexi.rw/",
  },
  {
    id: 6,
    title: "kalinga technology",
    imageUrl: kalinga,
    description:
      "Kalinga Technology is a leading platform for comprehensive technology solutions, offering expert repairs, premium tech products, and unmatched customer service",
    techStack: [
      "React.js",
      "Vite",
      "Node.js",
      "NestJS",
      "TailwindCSS",
      "MySQL",
      "Prisma",
      "Lucide-react",
    ],
    liveDemo: "https://kalingatech.netlify.app/",
  },
  {
    id: 7,
    title: "aby hr management system",
    imageUrl: abyhr,
    description:
      "ABY HR Management is a powerful platform built to empower businesses with world-class HR technology simplifying workforce management, streamlining processes, and driving organizational success.",
    techStack: [
      "React.js",
      "Vite",
      "Node.js",
      "NestJS",
      "TailwindCSS",
      "MySQL",
      "Prisma",
      "Lucide-react",
    ],
    liveDemo: "https://aby-hr.netlify.app/",
  },
];

// Project Card Component
const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border border-primary-100 group">
      {/* Project Image & Basic Info */}
      <div className="text-center mb-6">
        <div className="relative mb-6">
          <div className="w-full h-56 mx-auto rounded-xl overflow-hidden border-2 border-gray-300 group-hover:border-primary-600 transition-colors duration-300">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </div>

        <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors capitalize">
          {project.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[3rem]">
          {project.description}
        </p>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg hover:from-primary-100 hover:to-primary-200 transition-all text-center border border-primary-200">
          <div className="text-primary-600 font-bold text-lg">Live</div>
          <div className="text-gray-600 text-xs font-medium">Status</div>
        </div>
        <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-lg hover:from-secondary-100 hover:to-secondary-200 transition-all text-center border border-secondary-200">
          <div className="text-secondary-500 font-bold text-lg">
            {project.techStack.length}
          </div>
          <div className="text-gray-600 text-xs font-medium">Tech Stack</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 justify-center pt-2">
        {project.liveDemo && (
          <a
            href={project.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-primary-600 rounded-lg hover:bg-primary-700 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            title="Live Demo"
          >
            <ExternalLink className="w-5 h-5" />
            <span className="hidden sm:inline">View Live</span>
          </a>
        )}

        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-gray-800 rounded-lg hover:bg-gray-900 text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            title="View Code"
          >
            <Github className="w-5 h-5" />
            <span className="hidden sm:inline">Code</span>
          </a>
        )}
      </div>
    </div>
  );
};

// Main Projects Page Component
const ProjectsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / projectsPerPage);

  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col pb-8 items-center gap-12 mt-4 bg-white min-h-screen">
      <Header title="Our Projects" path="Project" />

      {/* Hero Section */}
      <div className="text-center mx-auto px-6 mt-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
          Our <span className="text-primary-600">Amazing Projects</span>
        </h1>
        <p className="text-gray-600 text-xl leading-relaxed mb-12">
          Discover our portfolio of innovative solutions. Each project
          represents our commitment to excellence, creativity, and
          cutting-edge technology implementation.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 shadow-lg border border-primary-200">
            <div className="text-4xl font-bold text-primary-600 mb-2">
              {projects.length}
            </div>
            <div className="text-gray-700 font-medium">Live Projects</div>
          </div>
          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8 shadow-lg border border-secondary-200">
            <div className="text-4xl font-bold text-secondary-500 mb-2">100%</div>
            <div className="text-gray-700 font-medium">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="w-full md:w-12/12 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === index + 1
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-primary-600 hover:bg-primary-50'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white border-2 border-gray-300 hover:border-primary-600 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-white transition-all duration-300"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;