import React from 'react';

const SubscribeSection = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-[50vh] bg-cover bg-center relative text-white">
             <div
        className="absolute inset-0 bg-black bg-opacity-100"
        style={{
            background:`linear-gradient( to right,rgba(0,0,0,0.7),rgba(0,0,0,0.5)), url('../image/blog6.jpg')`,
            backgroundPosition: `center`,
            backgroundRepeat:`no-repeat`,
            backgroundSize:`cover`
            
        }}
      ></div>
            <div className="absolute inset-0  bg-opacity-60"></div>
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-16" >
                    Trust Me to deliver the <span className="text-[#FFD44D]">best solutions</span><br />tailored to your needs.
                </h2>
              
                <div className="flex gap-2 mt-10 w-full max-w-md">
                    <input 
                        type="email" 
                        placeholder="Enter Your Email" 
                        className="p-3 rounded-md w-full bg-white text-black focus:outline-none" 
                    />
                    <button className="p-3 bg-[#FFD44D] hover:bg-[#FFD44D] text-white rounded-md w-[200px]">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscribeSection;