import React, { useEffect } from 'react';
import Header from '../../components/header';
import BlogCard from '../../components/blog/BlogCard';
import Testimonials from '../../components/home/testimony';
import { cards } from '../../stores/Blogdata';
import AOS from 'aos';
import SubscribeSection from '../../components/blog/subscribe';

const BlogPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'start',
    });
  }, []);

  return (
    <div className="w-full flex flex-col pb-6 justify-center bg-white items-center gap-12 mt-25">
      <Header title="blog" path="blog" />

      <div className="flex flex-col justify-center w-full lg:w-10/12 xl:w-11/12 pt-4 items-center gap-12">
        <div className="text-center">
          <h1 className="text-primary-600 font-bold text-3xl md:text-4xl lg:text-5xl">
            News <span className="text-gray-900">&</span> Blogs
          </h1>
          <p className="text-gray-600 text-lg mt-4 max-w-xl mx-auto">
            Stay updated with our latest insights, industry trends, and expert articles
          </p>
        </div>

        <div className="flex items-center gap-8 w-full justify-center flex-wrap px-4" data-aos="fade-down">
          {cards.map((card, key) => (
            <BlogCard {...card} key={key} />
          ))}
        </div>
      </div>

    </div>
  );
};

export default BlogPage;