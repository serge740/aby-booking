import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import Header from '../../components/header';
import { useNavigate, useParams } from 'react-router-dom';
import { blogPosts } from '../../stores/blogsData';

const BlogDetailPage = () => {
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saveInfo, setSaveInfo] = useState(false);
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const blogId = parseInt(id);

    const navigate = useNavigate();

  // Current blog post
  const currentPost = blogPosts.find(post => post.id === blogId);

  // Related posts (exclude current)
  const relatedPosts = blogPosts.filter(post => post.id !== blogId).slice(0, 3);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  // ✅ FIX: Helper function to ensure date is a proper Date object
  const getFormattedDate = (dateInput) => {
    const date = new Date(dateInput);
    return {
      day: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear()
    };
  };

  // ✅ FIX: Helper function to format comment date
  const formatCommentDate = (dateInput) => {
    const date = new Date(dateInput);
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Load comments and saved info from localStorage on mount
  useEffect(() => {
    // Load comments for this blog
    const savedComments = localStorage.getItem(`blog_comments_${blogId}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }

    // Load saved user info
    const savedInfo = localStorage.getItem('comment_info');
    if (savedInfo) {
      const { name: savedName, email: savedEmail } = JSON.parse(savedInfo);
      setName(savedName);
      setEmail(savedEmail);
      setSaveInfo(true);
    }
  }, [blogId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (comment.trim() && name.trim() && email.trim()) {
      const newComment = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        comment: comment.trim(),
        date: new Date(), // ✅ Always create fresh Date object
        blogId: blogId
      };

      // Add new comment to state
      const updatedComments = [newComment, ...comments];
      setComments(updatedComments);

      // Save to localStorage
      localStorage.setItem(`blog_comments_${blogId}`, JSON.stringify(updatedComments));

      // Reset form
      setComment('');
      if (!saveInfo) {
        setName('');
        setEmail('');
      }

      // Show success message
      console.log('Comment posted successfully!', newComment);
    }
  };

  if (!currentPost) {
    return <div className="text-center py-20">Blog post not found</div>;
  }

  // ✅ FIX: Get properly formatted date for current post
  const currentDate = getFormattedDate(currentPost.date);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={`single blog`} path={`blog / Single Blog 1`} />
      <div className="mx-auto px-4 md:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="mb-8">
              <img 
                src={currentPost.image} 
                alt={currentPost.title}
                className="w-full h-[50vh] object-cover"
              />
            </div>

             <h1 className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                              {currentPost.title}
                            </h1>

            {/* Content */}
            <div className="bg-white p-8 mb-6">
              <p className="text-gray-700 leading-relaxed mb-6">
                {currentPost.content}
              </p>

              {/* Quote */}
              <blockquote className="border-l-4 pl-6 py-4 mb-6" style={{ borderColor: '#c0aa83' }}>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {currentPost.quote}
                </p>
              </blockquote>

              <p className="text-gray-700 leading-relaxed">
                {currentPost.content2}
              </p>
            </div>

            {/* Post Meta */}
            <div className="bg-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-5xl font-light" style={{ color: '#c0aa83' }}>
                    {currentDate.day}
                  </span>
                  <div className="flex flex-col text-sm text-gray-600">
                    <span>{currentDate.month}</span>
                    <span>{currentDate.year}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Eye size={18} />
                    <span>{currentPost.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle size={18} />
                    <span>{comments.length}</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <span className="font-bold text-gray-800">Tags: </span>
                {currentPost.tags.map((tag, index) => (
                  <span key={index} style={{ color: '#c0aa83' }} className="mr-2">
                    {tag}
                  </span>
                ))}
              </div>

              <div>
                <span className="font-bold text-gray-800">Category: </span>
                {currentPost.category.map((cat, index) => (
                  <span key={index}>
                    <span style={{ color: '#c0aa83' }}>{cat}</span>
                    {index < currentPost.category.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-8">
              {/* Existing Comments */}
              {comments.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Comments ({comments.length})
                  </h2>
                  <div className="space-y-6 mb-8">
                    {comments.map((cmt) => (
                      <div key={cmt.id} className="border-b border-gray-100 pb-6">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">{cmt.name}</h4>
                          <span className="text-sm text-gray-500">
                            {formatCommentDate(cmt.date)}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{cmt.comment}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Add New Comment */}
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Comment</h2>
              
              <p className="text-sm text-gray-600 mb-6 text-center">
                Your email address will not be published. Required fields are marked <span className="text-red-500">*</span>
              </p>

              <form onSubmit={handleSubmit}>
                <textarea
                  placeholder="Comment *"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200 mb-4 resize-none"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveInfo}
                      onChange={(e) => setSaveInfo(e.target.checked)}
                      className="mt-1 mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Save my name, email, and website in this browser for the next time I comment.
                    </span>
                  </label>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="px-8 py-3 text-white font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#c0aa83' }}
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <div className="bg-white p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Related Posts</h3>
                <div className="space-y-6">
                  {relatedPosts.map(post => {
                    const relatedDate = getFormattedDate(post.date);
                    return (
                      <article key={post.id} className="group cursor-pointer" onClick={() => navigate(`/blog/${post.id}`)}>
                        <div className="flex gap-4 pb-5 border-b border-gray-100 last:border-0">
                          <div className="relative w-28 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                              {post.title}
                            </h4>
                            
                            <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                              <Calendar size={12} className="text-amber-700" />
                              <span>{relatedDate.month} {post.date.getDate?.() || relatedDate.day}, {relatedDate.year}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-500 text-xs">
                              <div className="flex items-center gap-1">
                                <Eye size={12} className="text-amber-700" />
                                <span>{post.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle size={12} className="text-amber-700" />
                                <span>{blogPosts.find(b => b.id === post.id)?.comments || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;