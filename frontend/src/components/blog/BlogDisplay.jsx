import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';
import { Eye, MessageCircle, ArrowRight } from 'lucide-react';
import { blogPosts } from '../../stores/blogsData';

const BlogCard = ({ image, title, content, content2, id, date, views, comments, category }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Format date
  const getFormattedDate = (dateInput) => {
    const d = new Date(dateInput);
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    return { day, month, year };
  };

  const postDate = getFormattedDate(date);
  
  // Get excerpt from content
  const excerpt = (content2 || content).substring(0, 150) + '...';

  return (
    <article 
      className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
      data-aos="fade-up"
      data-aos-duration="800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/blog/${id}`)}
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Category Badge */}
        {category && category.length > 0 && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
            {Array.isArray(category) ? category[0] : category}
          </div>
        )}

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg text-center">
          <div className="text-3xl font-bold text-red-600">{postDate.day}</div>
          <div className="text-xs text-gray-600 uppercase">{postDate.month}</div>
        </div>

        {/* Stats on Image (visible on hover) */}
        <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between text-white transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Eye size={14} />
              <span className="text-sm font-medium">{views}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <MessageCircle size={14} />
              <span className="text-sm font-medium">{comments}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Title */}
        <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {excerpt}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Eye size={16} />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <span>{comments}</span>
            </div>
          </div>

          {/* Read More Button */}
          <button className="flex items-center gap-2 text-red-600 font-semibold text-sm group-hover:gap-3 transition-all">
            Read
            <ArrowRight size={16} />
          </button>
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
    <section className="w-full py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-16">
        {/* Section Header */}
        <div className="text-center mb-12" data-aos="fade-down">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-black">Latest</span> <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">News & Blogs</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the rich culinary world of Rwanda through our expertly crafted articles
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
            className="px-10 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto"
          >
            View All Articles
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogLatest;