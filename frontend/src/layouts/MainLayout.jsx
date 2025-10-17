import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import FooterContent from '../components/footer'

const MainLayout = () => {
  const location = useLocation();
  useEffect(() => {
    document.body.scrollIntoView({
      behavior: "smooth",
      block: "start",
      // inline: "start",
    });

  }, [location.pathname]);
  return (
    <div className='min-h-dvh text-white flex justify-between items-stretch flex-col bg-white'>

    <Navbar />
    <Outlet />
    <FooterContent />


    </div>
  )
}

export default MainLayout