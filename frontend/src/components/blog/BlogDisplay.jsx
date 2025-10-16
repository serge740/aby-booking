
import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { cards } from '../../stores/Blogdata';
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ image, title, description, id }) => {
  const navigate = useNavigate();

  return (
    <div
      className="h-full bg-white border-2 border-gray-200 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-2xl hover:border-primary-400 transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/blog/${id}`)}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 mb-4">
        <img
          src={image}
          className="w-full h-full object-cover rounded-lg"
          alt={title}
        />
        <button className="absolute top-2 left-2 px-3 py-1.5 capitalize text-white font-medium text-xs bg-primary-400 group-hover:bg-primary-500 transition duration-200 ease-in-out rounded-md">
          Content Tips
        </button>
      </div>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 min-h-16 line-clamp-3">
        {description}
      </p>

      {/* Divider */}
      <div className="w-12 h-1 bg-gradient-to-r from-primary-400 to-primary-300 rounded-full"></div>
    </div>
  );
};

const BlogLatest = () => {
    const navigate =  useNavigate()
    
    return (
        <div className='w-full   flex-col sm:flex-row pb-7 justify-center bg-[white]  items-center flex gap-2' onClick={()=>navigate('/blog/2')}>
            <div className="flex flex-col justify-center w-11/12 pt-10 items-center gap-10">

                <h1 className='text-primary-300 font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl'><span className='text-black'> Latest </span> News & Blogs</h1>

                <div className="flex items-start gap-9 justify-center ">

                    {
                        cards.map((card, key) => {
                            if (key >= 3) {
                                return
                            }
                            return <BlogCard {...card} key={key} ></BlogCard>
                        }
                        )
                    }

                </div>


            </div>
        </div>

      
  );
};

export default BlogLatest;