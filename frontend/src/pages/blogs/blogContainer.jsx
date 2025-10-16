import React from 'react';

const NewsAndBlogs = () => {
  const posts = [
    {
      title: 'How do you improve your content writing skills?',
      description: 'Amet a est nisi nisl blandit. Ullamcorper odio eu dui lectus tellus ultricies pellentesque.',
      image: '../assets/images/blog/blog3.png',
    },
    {
      title: 'Do you want to become a professional writer?',
      description: 'Lacinia justo nulla id elit. Vel mi tellus vitae nulla viverra tellus a nulla nam sit tincidunt.',
      image: '../assets/images/blog/blog1.png',
    },
    {
      title: 'Strengthen the foundations to scale to your skills',
      description: 'Euismod suspendisse elit eu iaculis tincidunt aliquam in rutrum arcu et faucibus.',
      image: '../assets/images/blog/blog2.png',
    }
  ];

  return (
    <section className="bg-[#0e1323] py-12">
      <div className="max-w-9xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-yellow-400 mb-8">News & Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <div key={index} className="bg-[#1a1f33] rounded-2xl overflow-hidden shadow-md">
              <div className="relative">
                <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                <span className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-md text-sm font-semibold">
                  Content Tips
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-white text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{post.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-4 right-4 bg-yellow-400 text-black p-2 rounded-full shadow-md cursor-pointer">
        <span className="text-xl">↑</span>
      </div>
    </section>
  );
};

export default NewsAndBlogs;