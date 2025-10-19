import React from 'react'

const Header = ({title, path}) => {
    return (
        <div className='relative w-full h-[50vh] flex justify-center items-center overflow-hidden'>
            {/* Background Image with Overlay */}
            <div 
                className='absolute bg-fixed   inset-0 bg-cover bg-botoom bg-no-repeat'
                style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80)`,
                }}
            >
                {/* Gradient Overlays */}
                <div className='absolute inset-0 bg-gradient-to-r from-secondary-900/10 via-secondary-800/10 to-secondary-700/15'></div>
                <div className='absolute inset-0 bg-gradient-to-b from-transparent via-secondary-900/10 to-secondary-900/10'></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col h-full justify-center items-center px-4">
                {/* Decorative Top Line */}
                <div className='w-24 h-1 bg-secondary-500 mb-6 rounded-full'></div>
                
                {/* Title */}
                <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl  font-bold uppercase text-center text-white mb-4 tracking-wide drop-shadow-2xl'>
                    {title}
                </h1>
                
                {/* Breadcrumb */}
                <div className='flex items-center gap-2 text-sm sm:text-base'>
                    <span className='text-secondary-100 hover:text-white transition-colors cursor-pointer font-medium'>
                        Home
                    </span>
                    <span className='text-secondary-300'>/</span>
                    <span className='text-white font-medium capitalize'>
                        {path}
                    </span>
                </div>

                {/* Decorative Bottom Line */}
                <div className='w-24 h-1 bg-secondary-500 mt-6 rounded-full'></div>
            </div>

            {/* Bottom Fade Effect */}
            <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-secondary-900/40 to-transparent'></div>
        </div>
    )
}

export default Header