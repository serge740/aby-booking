import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ image, title, description }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex w-full sm:w-9/12 md:w-1/3 xl:w-3/12 flex-auto transition-all duration-300 ease-in-out flex-col gap-4 group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 border border-primary-100"
      onClick={() => navigate('/blog/1')}
    >
      <div className="flex w-full h-64 relative overflow-hidden rounded-t-xl">
        <img
          src={image}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={title}
        />
        <button className="absolute top-3 left-3 px-3 py-1 capitalize text-white font-semibold text-xs bg-primary-600 group-hover:bg-primary-700 cursor-pointer transition-all duration-300 ease-in-out rounded-md shadow-lg">
          content tips
        </button>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-3">
        <h1 className="text-lg md:text-xl xl:text-2xl capitalize font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2">
          {title}
        </h1>
        <p className="text-sm md:text-base text-gray-600 line-clamp-3 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm mt-auto group-hover:gap-3 transition-all duration-300">
          <span>Read More</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;