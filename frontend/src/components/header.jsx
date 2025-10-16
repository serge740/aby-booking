import React from 'react'
import HeaderImage from "../assets/images/header.avif"

const Header = ({title, path}) => {
    return (
        <div className='w-full h-[55vh] -mt-8' style={{
background: `linear-gradient(
    to right, 
    rgba(0, 0, 0, 0.6),  /* darker overlay */
    rgba(0, 0, 0, 0.4)
  ), 
  url(${HeaderImage})`,
            backgroundPosition: `center`,
            backgroundRepeat: `no-repeat`,
            backgroundSize: `cover`                     
        }}>
            <div className="flex flex-col h-full text-white justify-center gap-3 items-center">
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-semibold uppercase pt-28' style={{fontSize: "2.2rem"}}>
                    {title}
                </h1>
                <p className='capitalize'>
                    <span style={{color: "#2563eb"}}>Home /</span> {path}
                </p>
            </div>
        </div>
    )
}

export default Header