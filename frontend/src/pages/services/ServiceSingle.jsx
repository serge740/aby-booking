import React, { useEffect } from 'react'
import Header from '../../components/header'
import BlogLatest from '../../components/blog/BlogDisplay'
import BlogImage1 from '../../assets/images/blog/blog2.jpg'
import BlogImage2 from '../../assets/images/blog/blog4.jpg'
import { FaSquareCheck } from "react-icons/fa6";
import BlogImage3 from '../../assets/images/blog/blog3.jpg'
import { BsShare } from 'react-icons/bs'
import { useParams } from 'react-router-dom'
import { FaLongArrowAltRight } from "react-icons/fa";

const ServiceSingle = () => {
    const { id } = useParams()
    useEffect(() => {

        document.documentElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'start',
        })
    }, [id])

    const lists = [
        { name: "Web Copywriter", active: true },
        { name: " Digital Copywriting", active: false },
        { name: " Email Copywriting", active: false },
        { name: " Blog Content Writer", active: false },
        { name: " Press Release Writer", active: false },
        { name: " Video Script Writer", active: false },
    ]
    return (
        <div className='w-full flex-col pb-7  justify-center bg-[#0d0f15]  items-center flex gap-2'>
            <Header title={`service`} path={`service / Single Service 1`} />

            <div className="flex  justify-center p-4 w-full md:w-10/12 flex-wrap xl:flex-nowrap  lg:w-9/12 pt-10 items-start gap-7">

                {/* left side */}
                <div className="flex flex-col w-full sm:w-11/12 md:w-10/12 xl:w-9/12  gap-4">
                    <div className="h-[49vh] w-full">
                        <img src={BlogImage1} className='w-full h-full object-cover ' alt="" />
                    </div>
                    <h1 className='text-2xl capitalize md:text-3xl'>web copy writer</h1>

                    <p className='text-neutral-500  md:text-base xl:text-lg'>
                        Commodo semper bibendum adipiscing orci bibendum eu lectus sed.
                        Commodo cursus vitae augue luctus nibh. Congue sit quisque volutpat libero tempor a id cursus purus.
                        Pellentesque pellentesque scelerisque curabitur porta dolor. Amet vulputate vitae eget sit rhoncus imperdiet.
                        Odio justo nullam scelerisque quis bibendum. Cras ipsum vel diam praesent tortor at elit sit.
                        A risus molestie bibendum donec blandit adipiscing volutpat sollicitudin aliquam.
                        Nec arcu cras ultrices velit sed ligula. Iaculis elit vulputate sollicitudin quisque ut faucibus.
                    </p>

                    <div className="flex w-full gap-4 flex-wrap ">
                        <div className=" max-h-72 md:flex-1/3 ">
                            <img src={BlogImage3} className='w-full h-full object-cover ' alt="" />
                        </div>


                        <div className="flex md:flex-1/3 flex-col gap-3">
                            <h1 className='text-2xl xl:text-3xl capitalize'>Content Write Checklist</h1>
                            <p className='hover:text-amber-300 transition-all  ease-linear text-base cursor-pointer md:text-lg font-medium flex items-center gap-3 justify-start'>
                                <span><FaSquareCheck className='w-8 h-8 fill-amber-300' /></span>
                                We Create High Quality Content
                            </p>
                            <p className='hover:text-amber-300 transition-all  ease-linear text-base cursor-pointer md:text-lg font-medium flex items-center justify-start gap-3'>
                                <span><FaSquareCheck className='w-8 h-8 fill-amber-300' /></span>
                                We Focus on Well Organize Content.
                            </p>
                            <p className='hover:text-amber-300 transition-all  ease-linear text-base cursor-pointer md:text-lg font-medium flex items-center justify-start gap-3'>
                                <span><FaSquareCheck className='w-8 h-8 fill-amber-300' /></span>
                                We Deliver On Time.
                            </p>
                            <p className='hover:text-amber-300 transition-all  ease-linear text-base cursor-pointer md:text-lg font-medium flex items-center justify-start gap-3'>
                                <span><FaSquareCheck className='w-8 h-8 fill-amber-300' /></span>
                                We have best writer resources.
                            </p>
                            <p className='hover:text-amber-300 transition-all  ease-linear text-base cursor-pointer md:text-lg font-medium flex items-center justify-start gap-3'>
                                <span><FaSquareCheck className='w-8 h-8 fill-amber-300' /></span>
                                Content Campaigns.
                            </p>



                        </div>
                    </div>


                    <p className='text-neutral-500  md:text-base xl:text-lg'>
                        Tortor quam congue habitasse egestas facilisi quis feugiat.
                        Leo semper quisque ipsum felis feugiat dolor erat.
                        Pellentesque sit a pellentesque sed amet ac ipsum ac. Leo eget at ultricies varius.
                        Leo facilisis nec malesuada posuere nulla aliquet sed purus dolor.
                        Sit parturient varius egestas et ut orci viverra venenatis.
                        Arcu enim ut malesuada orci sit mattis a lectus. Cursus penatibus fusce et vel nullam.
                        Auctor non laoreet nibh tellus consequat risus nibh volutpat. Neque volutpat amet varius at eget lectus.
                    </p>





                    <div className="flex flex-col flex-wrap gap-7 w-full">

                        <div className="flex w-full flex-wrap gap-4 ">
                            <div className="flex-1/2 md:flex-1/3  min-h-80 ">
                                <img src={BlogImage3} className='w-full h-full object-cover ' alt="" />
                            </div>
                            <div className="flex-1/2 md:flex-1/3 min-h-80 ">
                                <img src={BlogImage2} className='w-full h-full object-cover ' alt="" />
                            </div>
                        </div>

                    </div>

                    <p className='text-neutral-500  md:text-base xl:text-lg'>
                        Facilisis nec malesuada enim viverra cras. Auctor dignissim tellus vestibulum vitae hac amet.
                        Suspendisse sit feugiat in pulvinar bibendum arcu nunc id. Duis hac nisl dui facilisi placerat at mauris elit scelerisque.
                        Turpis ornare auctor amet vestibulum in magna aliquet ultricies netus.
                        Adipiscing lobortis a interdum morbi etiam non. Elit sed magna risus tempor non quis. Nec pulvinar scelerisque in faucibus.
                    </p>
                    <p className='text-neutral-500  md:text-base xl:text-lg'>
                        Dis morbi cursus aliquam rutrum tortor amet.
                        Mauris consequat libero praesent pellentesque nibh sed eget urna.
                        Leo at feugiat vel dictum eget quam et commodo nullam. Nec arcu egestas adipiscing mollis dapibus justo non.


                    </p>


                    <div className="flex  justify-center w-full">
                        <div className="w-5/12 border border-l-0 py-2 border-zinc-700 flex justify-start items-center">
                            <p className='capitalize'>prev</p>
                        </div>
                        <div className="w-2/12  border border-x-0  py-2 border-zinc-700 flex justify-center items-center">
                            <BsShare className='w-4 h-4' />
                        </div>
                        <div className="w-5/12 border border-r-0  py-2 border-zinc-700 flex justify-end items-center">
                            <p className='capitalize'>next</p>
                        </div>
                    </div>

                </div>

                {/* right side */}

                <div className="flex flex-col w-full gap-7 md:w-10/12  xl:w-4/12 ">



                    <div className="flex justify-center gap-3 w-full p-8 border border-zinc-600 items-center flex-col">
                        <h1 className=' text-2xl md:text-3xl xl:text-4xl'>Service List</h1>

                        <div className="flex flex-col  w-full gap-3">

                            {
                                lists.map((list, key) => (

                                    <div key={key} className={`flex p-4 gap-2 border w-full  ${list.active ? `bg-[#FF9078]` : `bg-zinc-800`} border-zinc-600`}>

                                        <FaLongArrowAltRight className='w-6 h-6' />
                                        <p className={` text-base lg:text-lg xl:text-xl capitalize font-light  `}>{list.name}</p>
                                    </div>
                                ))
                            }

                        </div>
                    </div>


                    <div className="bg-zinc-800 border gap-2 flex items-center justify-center flex-col  border-zinc-700 p-10">

                        <h1 className=' text-xl md:text-2xl lg:text-3xl xl:text-4xl capitalize '>get in touch</h1>
                        <p className='text-neutral-400 text-sm md:text-base text-center'>Ready to assist you in resolving any issues you may have.</p>
                        <button className='p-3 cursor-pointer bg-[#FF9078] w-52 text-xl'>Submit Now</button>

                    </div>





                </div>



            </div>

            <BlogLatest />
        </div>
    )
}

export default ServiceSingle