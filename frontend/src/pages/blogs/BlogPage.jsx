import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, MessageCircle, Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { blogPosts } from '../../stores/blogsData';
import Header from '../../components/header';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1));
  const [postsWithComments, setPostsWithComments] = useState(blogPosts);
  const [hoveredPostId, setHoveredPostId] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getFormattedDate = (dateInput) => {
    const date = new Date(dateInput);
    return {
      day: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear()
    };
  };

  useEffect(() => {
    const updatedPosts = blogPosts.map(post => {
      const savedComments = localStorage.getItem(`blog_comments_${post.id}`);
      const commentCount = savedComments ? JSON.parse(savedComments).length : post.comments;
      return { ...post, comments: commentCount };
    });
    setPostsWithComments(updatedPosts);
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(blogPosts.flatMap(post => post.category))];
    return uniqueCategories;
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const selectDate = (day) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(selected);
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const filteredPosts = useMemo(() => {
    return postsWithComments.filter(post => {
      const matchesCategory = selectedCategory === 'all' || 
        post.category.some(cat => cat === selectedCategory);
      
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = !selectedDate || isSameDay(post.date, selectedDate);
      
      return matchesCategory && matchesSearch && matchesDate;
    });
  }, [selectedCategory, searchQuery, selectedDate, postsWithComments]);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header path={'Blogs'} title={'Blogs'} />
      
      <div className="mx-auto px-4 md:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map(post => {
                const postDate = getFormattedDate(post.date);
                const isHovered = hoveredPostId === post.id;
                
                return (
                  <article 
                    key={post.id} 
                    className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
                    onMouseEnter={() => setHoveredPostId(post.id)}
                    onMouseLeave={() => setHoveredPostId(null)}
                    onClick={() => navigate(`/blog/${post.id}`)}
                  >
                    <div className="relative overflow-hidden h-64">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                      
                      {/* Category Badge */}
                      {post.category && post.category.length > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                          {Array.isArray(post.category) ? post.category[0] : post.category}
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
                            <span className="text-sm font-medium">{post.views}</span>
                          </div>
                          <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <MessageCircle size={14} />
                            <span className="text-sm font-medium">{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Title */}
                      <h2 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                        {post.content2 || post.content}
                      </p>

                      {/* Divider */}
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                      {/* Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                          <div className="flex items-center gap-2">
                            <Eye size={16} />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle size={16} />
                            <span>{post.comments}</span>
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
              })}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No blog posts found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Search */}
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <Search size={20} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map(category => (
                    <li key={category}>
                      <button
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full text-left px-3 py-2 transition-colors ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="mr-2">›</span>
                        {category === 'all' ? 'All Posts' : category}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;