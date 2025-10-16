import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import FooterContent from '../components/footer'

const MainLayout = () => {
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);
  return (
    <div className='min-h-dvh text-white flex justify-between items-stretch flex-col bg-white'>

    <Navbar />
    <Outlet />
    <FooterContent />


    </div>
  )
}

export default MainLayout