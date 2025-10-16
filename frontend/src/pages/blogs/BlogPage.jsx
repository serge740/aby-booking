import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, MessageCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../../components/header';
import { blogPosts } from '../../stores/blogsData'; // ✅ IMPORT REAL DATA

import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 9, 1)); // October 2025
  const [postsWithComments, setPostsWithComments] = useState(blogPosts); // ✅ Track real comment counts

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
    const navigate = useNavigate();

  // ✅ FIX: Helper function to ensure date is a proper Date object
  const getFormattedDate = (dateInput) => {
    const date = new Date(dateInput);
    return {
      day: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear()
    };
  };

  // ✅ SYNC: Load real comment counts from localStorage
  useEffect(() => {
    const updatedPosts = blogPosts.map(post => {
      const savedComments = localStorage.getItem(`blog_comments_${post.id}`);
      const commentCount = savedComments ? JSON.parse(savedComments).length : post.comments;
      return { ...post, comments: commentCount };
    });
    setPostsWithComments(updatedPosts);
  }, []);

  // Get all unique categories from real data
  const categories = useMemo(() => {
    const uniqueCategories = ['all', ...new Set(blogPosts.flatMap(post => post.category))];
    return uniqueCategories;
  }, []);

  // Calendar functions
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

  // Filter posts using REAL data
  const filteredPosts = useMemo(() => {
    return postsWithComments.filter(post => {
      // ✅ Handle multiple categories
      const matchesCategory = selectedCategory === 'all' || 
        post.category.some(cat => cat === selectedCategory);
      
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.content?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDate = !selectedDate || isSameDay(post.date, selectedDate);
      
      return matchesCategory && matchesSearch && matchesDate;
    });
  }, [selectedCategory, searchQuery, selectedDate, postsWithComments]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="blog" path="blog" />
      <div className="mx-auto px-4 md:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPosts.map(post => {
                const postDate = getFormattedDate(post.date); // ✅ FIXED DATE
                return (
                  <article key={post.id} className="bg-white overflow-hidden">
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="py-6 p-4" onClick={() => navigate(`/blog/${post.id}`)} style={{ cursor: 'pointer' }}>
                      <h2 className="text-2xl font-semibold mb-4" style={{ color: '#c0aa83' }}>
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed mb-6">
                        {post.content2 || post.content} {/* ✅ Use content2 if available */}
                      </p>
                      <div className="flex items-center justify-between text-gray-500 text-sm">
                        <div className="flex items-center space-x-3">
                          <span className="text-5xl font-light" style={{ color: '#c0aa83' }}>
                            {postDate.day} {/* ✅ FIXED */}
                          </span>
                          <div className="flex flex-col text-xs">
                            <span>{postDate.month}</span> {/* ✅ FIXED */}
                            <span>{postDate.year}</span> {/* ✅ FIXED */}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye size={16} />
                            <span>{post.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle size={16} />
                            <span>{post.comments}</span> {/* ✅ REAL comment count */}
                          </div>
                        </div>
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
                    className="w-full px-4 py-2 pr-10 border text-black border-gray-300 focus:outline-none focus:ring-2"
                    style={{ focusRingColor: '#c0aa83' }}
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
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                        style={selectedCategory === category ? { backgroundColor: '#c0aa83' } : {}}
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