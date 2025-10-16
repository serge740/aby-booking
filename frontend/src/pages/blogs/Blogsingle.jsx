import React, { useEffect } from 'react'
import Header from '../../components/header'
import BlogLatest from '../../components/blog/BlogDisplay'
import BlogImage1 from '../../assets/images/blog/blog2.jpg'
import BlogImage2 from '../../assets/images/blog/blog4.jpg'
import { FaSquareCheck } from "react-icons/fa6";
import BlogImage3 from '../../assets/images/blog/blog3.jpg'
import { BsShare } from 'react-icons/bs'
import { useParams } from 'react-router-dom'

const BlogSingle = () => {
    const {id} = useParams()
    useEffect(()=>{
        document.documentElement.scrollIntoView({
            behavior:'smooth',
            block:'start',
            inline:'start',
        })
    },[id])
    
    return (
        <div className='w-full flex flex-col pb-6 justify-center bg-white items-center gap-8'>
            <Header title={`single blog`} path={`blog / Single Blog 1`} />

            <div className="flex justify-center p-4 w-full md:w-10/12 lg:w-9/12 xl:w-11/12 pt-10 items-start gap-10 max-w-8xl mx-auto">

                {/* left side */}
                <div className="flex flex-col w-full xl:w-7/12 gap-8">
                    <div>
                        <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 capitalize mb-4'>
                            How do you improve your content writing skills?
                        </h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <span className="text-sm">By Jordan Smith</span>
                            <span>•</span>
                            <span className="text-sm">5 min read</span>
                        </div>
                    </div>

                    <p className='text-gray-600 md:text-base lg:text-lg leading-relaxed'>
                        Commodo semper bibendum adipiscing orci bibendum eu lectus sed.
                        Commodo cursus vitae augue luctus nibh. Congue sit quisque volutpat libero tempor a id cursus purus.
                        Pellentesque pellentesque scelerisque curabitur porta dolor. Amet vulputate vitae eget sit rhoncus imperdiet.
                        Odio justo nullam scelerisque quis bibendum. Cras ipsum vel diam praesent tortor at elit sit.
                        A risus molestie bibendum donec blandit adipiscing volutpat sollicitudin aliquam.
                        Nec arcu cras ultrices velit sed ligula. Iaculis elit vulputate sollicitudin quisque ut faucibus.
                    </p>

                    <p className='text-gray-600 md:text-base lg:text-lg leading-relaxed'>
                        Facilisis nec malesuada enim viverra cras. Auctor dignissim tellus vestibulum vitae hac amet.
                        Suspendisse sit feugiat in pulvinar bibendum arcu nunc id.
                        Duis hac nisl dui facilisi placerat at mauris elit scelerisque.
                        Turpis ornare auctor amet vestibulum in magna aliquet ultricies netus.
                        Adipiscing lobortis a interdum morbi etiam non.
                    </p>

                    <div className="p-8 bg-orange-50 border-l-4 border-[#FF9078] rounded-lg">
                        <p className='italic text-gray-700 mb-4'>
                            "Mattis facilisis quam amet blandit faucibus. Sed in vitae montes sem quis faucibus bibendum massa.
                            Eget volutpat molestie eget non netus nisl eleifend.
                            Sit pellentesque posuere vitae scelerisque vel aliquet vulputate purus.
                            Ac risus neque sed at pellentesque ultrices."
                        </p>
                        <div className='flex gap-3 items-center text-gray-700 font-semibold'>
                            <div className='h-0 border-2 border-[#FF9078] w-12'></div>
                            <p>By Jordan Smith</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-wrap w-full gap-4">
                            <div className="flex-1 md:flex-none md:w-1/3 h-64 rounded-lg overflow-hidden shadow-md">
                                <img src={BlogImage3} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' alt="Blog" />
                            </div>
                            <div className="flex-1 md:flex-none md:w-1/3 h-64 rounded-lg overflow-hidden shadow-md">
                                <img src={BlogImage2} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' alt="Blog" />
                            </div>
                        </div>
                        <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
                            <img src={BlogImage1} className='w-full h-full object-cover hover:scale-105 transition-transform duration-300' alt="Blog" />
                        </div>
                    </div>

                    <p className='text-gray-600 md:text-base lg:text-lg leading-relaxed'>
                        Facilisis nec malesuada enim viverra cras. Auctor dignissim tellus vestibulum vitae hac amet.
                        Suspendisse sit feugiat in pulvinar bibendum arcu nunc id. Duis hac nisl dui facilisi placerat at mauris elit scelerisque.
                        Turpis ornare auctor amet vestibulum in magna aliquet ultricies netus.
                        Adipiscing lobortis a interdum morbi etiam non. Elit sed magna risus tempor non quis. Nec pulvinar scelerisque in faucibus.
                    </p>
                    
                    <p className='text-gray-600 md:text-base lg:text-lg leading-relaxed'>
                        Dis morbi cursus aliquam rutrum tortor amet.
                        Mauris consequat libero praesent pellentesque nibh sed eget urna.
                        Leo at feugiat vel dictum eget quam et commodo nullam. Nec arcu egestas adipiscing mollis dapibus justo non.
                    </p>

                    {/* Navigation */}
                    <div className="flex justify-between items-center w-full border-t border-b border-gray-300 py-6 mt-4">
                        <button className='flex items-center gap-2 text-gray-700 font-semibold hover:text-[#FF9078] transition-colors duration-300'>
                            <span>←</span>
                            <span className='capitalize'>Previous Post</span>
                        </button>
                        <button className='p-3 rounded-lg bg-gray-100 hover:bg-[#FF9078] hover:text-white text-gray-700 transition-all duration-300' title="Share">
                            <BsShare className='w-5 h-5' />
                        </button>
                        <button className='flex items-center gap-2 text-gray-700 font-semibold hover:text-[#FF9078] transition-colors duration-300'>
                            <span className='capitalize'>Next Post</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>

                {/* right side */}
                <div className="flex flex-col w-full xl:w-5/12 gap-8">

                    {/* Search Box */}
                    <div className="w-full">
                        <input 
                            type="text" 
                            className='bg-white p-4 w-full text-lg rounded-lg text-gray-900 border-2 border-gray-300 focus:border-[#FF9078] focus:outline-none transition-colors placeholder-gray-500' 
                            placeholder='Search articles...' 
                        />
                    </div>

                    {/* Category Section */}
                    <div className="flex flex-col w-full p-8 border-2 border-gray-300 rounded-lg shadow-md">
                        <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-6'>Categories</h2>

                        <div className="flex flex-col gap-4">
                            {[
                                'Fiction Writers',
                                'Content Writers',
                                'Digital Writers',
                                'Business Writers',
                                'Technical Writers',
                                'Marketing Writers'
                            ].map((category, index) => (
                                <label key={index} className='flex items-center gap-3 cursor-pointer group'>
                                    <div className='w-5 h-5 border-2 border-[#FF9078] rounded-md flex items-center justify-center group-hover:bg-[#FF9078] transition-colors duration-300'>
                                        <FaSquareCheck className='w-4 h-4 text-[#FF9078] opacity-0 group-hover:opacity-100 transition-opacity' />
                                    </div>
                                    <p className='text-base md:text-lg font-medium text-gray-700 group-hover:text-[#FF9078] transition-colors duration-300'>
                                        {category}
                                    </p>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* CTA Box */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg gap-4 flex items-center justify-center flex-col p-8 shadow-md">
                        <h3 className='text-2xl md:text-3xl font-bold text-gray-900 capitalize text-center'>Get in Touch</h3>
                        <p className='text-gray-600 text-sm md:text-base text-center'>Ready to assist you in resolving any issues you may have.</p>
                        <button className='px-8 py-3 cursor-pointer bg-[#FF9078] hover:bg-[#ff6f6f] text-white font-bold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto'>
                            Submit Now
                        </button>
                    </div>
                </div>
            </div>

            <BlogLatest />
        </div>
    )
}

export default BlogSingle