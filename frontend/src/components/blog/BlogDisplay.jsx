import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageCircle } from 'lucide-react';
import { blogPosts } from '../../stores/blogsData';


const BlogCard = ({ image, title, content, content2, id, date, views, comments, category }) => {
  const navigate = useNavigate();
  
  // Format date
const getFormattedDate = (dateInput) => {
  const d = new Date(dateInput);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }); // ✅ fixed
  const year = d.getFullYear();
  return { day, month, year };
};


  const postDate = getFormattedDate(date);
  
  // Get excerpt from content (first 150 characters)
  const excerpt = (content2 || content).substring(0, 200) + '...';

  return (
    <article 
      className="bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div 
        className="py-6 p-4 cursor-pointer" 
        onClick={() => navigate(`/blog/${id}`)}
      >
        <h2 className="text-2xl font-semibold mb-4 hover:opacity-80 transition-opacity" style={{ color: '#6F4E37' }}>
          {title}
        </h2>
        <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
          {excerpt}
        </p>
        <div className="flex items-center justify-between text-gray-500 text-sm">
          <div className="flex items-center space-x-3">
            <span className="text-5xl font-light" style={{ color: '#6F4E37' }}>
              {postDate.day}
            </span>
            <div className="flex flex-col text-xs">
              <span>{postDate.month}</span>
              <span>{postDate.year}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye size={16} />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const BlogLatest = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out',
    });
  }, []);

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-black">Latest</span> <span className="text-[#6F4E37]">News & Blogs</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the rich world of coffee through our expertly crafted articles
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.id} {...post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center" data-aos="fade-up" data-aos-delay="200">
          <button
            onClick={() => navigate('/blogs')}
            className="px-8 py-4 bg-[#6F4E37] text-white font-semibold rounded-lg hover:bg-[#5a3d2a] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            View All Articles →
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogLatest;