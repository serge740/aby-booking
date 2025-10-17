import React, { lazy, useEffect } from "react";
import Menu from "../components/home/Menu";
import Header from "../components/header";


const ServicePage = () => {
  useEffect(() => {
    document.documentElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "start",
    });
  }, []);
  return (
    <section className="bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50  text-center min-h-screen">
      <Header title={`our menu`} path={`menu`} />
      <Menu />
</section>
  );
};

export default ServicePage;