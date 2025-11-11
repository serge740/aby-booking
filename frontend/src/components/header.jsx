import React from 'react'

const Header = ({title, path}) => {
    return (
         <div className="relative w-full h-96 bg-gradient-to-r from-black via-gray-900 to-black overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&h=600&fit=crop)'
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-orange-500 text-lg mb-4 font-semibold tracking-wider uppercase">Discover {!path?.toLowerCase()?.includes('our') && 'Our'} {path}</p>
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">{title}</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
          </div>
        </div>
      </div>
    )
}

export default Header