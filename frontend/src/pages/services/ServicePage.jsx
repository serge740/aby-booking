import React, { lazy, useEffect } from "react";
import Header from "../../components/header";
// import { useLocation, useParams } from 'react-router-dom';
const ContentWriteServices = lazy(() =>
  import("../../components/home/contentWrite")
);
const Testimonials = lazy(() => import("../../components/home/testimony"));
const BlogLatest = lazy(() => import("../../components/blog/BlogDisplay.jsx"));

const ServicePage = () => {
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);
  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-4 text-center min-h-screen">
      <Header title={`service`} path={`service`} />

      <div className="flex flex-col justify-center w-[100%]  items-center gap-10">
        <ContentWriteServices />
    
      </div>
</section>
  );
};

export default ServicePage;