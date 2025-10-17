import React from 'react'

const Header = ({title, path}) => {
    return (
        <div className='relative w-full h-[50vh] flex justify-center items-center overflow-hidden'>
            {/* Background Image with Overlay */}
            <div 
                className='absolute inset-0 bg-cover bg-center bg-no-repeat'
                style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=2000&auto=format&fit=crop)`,
                }}
            >
                {/* Gradient Overlays */}
                <div className='absolute inset-0 bg-gradient-to-r from-primary-900/40 via-primary-800/30 to-primary-700/25'></div>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/20 to-primary-950/40'></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full justify-center items-center px-4">
                {/* Decorative Top Line */}
                <div className='w-24 h-1 bg-primary-500 mb-6 rounded-full'></div>
                
                {/* Title */}
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold uppercase text-center text-white mb-4 tracking-wide drop-shadow-2xl'>
                    {title}
                </h1>
                
                {/* Breadcrumb */}
                <div className='flex items-center gap-2 text-sm sm:text-base'>
                    <span className='text-primary-100 hover:text-white transition-colors cursor-pointer font-medium'>
                        Home
                    </span>
                    <span className='text-primary-300'>/</span>
                    <span className='text-white font-medium capitalize'>
                        {path}
                    </span>
                </div>

                {/* Decorative Bottom Line */}
                <div className='w-24 h-1 bg-primary-500 mt-6 rounded-full'></div>
            </div>

            {/* Bottom Fade Effect */}
            <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary-900/40 to-transparent'></div>
        </div>
    )
}

export default Header