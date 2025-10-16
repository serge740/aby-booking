import React, { lazy } from 'react';
import BlogLatest from '../components/blog/BlogDisplay';
import Partners from '../components/home/Partners';
import HomeAbout from '../components/home/HomeAbout';
import Values from '../components/home/Values';
import Programs from '../components/home/Programs';

const LandingPage = lazy(() => import("../components/home/landingPage"));
const WhyChooseUs = lazy(() => import("../components/home/chooseUs"));
const ClientsSection = lazy(() => import("../components/home/clients"));
const ContentReach = lazy(() => import("../components/home/contentReach"));
const ContentWriteServices = lazy(() =>
  import("../components/home/contentWrite")
);
const WorkProcess = lazy(() => import("../components/home/workingProcess"));
const ContentSection = lazy(() => import("../components/home/talkContent"));
const LatestProjects = lazy(() => import("../components/home/project"));
const Testimonials = lazy(() => import("../components/home/testimony"));

const HomePage = () => {
    return (
        <>
            <LandingPage />
            <HomeAbout />
            <Values />
            <WhyChooseUs />
            <ContentReach />
 
            <WorkProcess />
            <Programs />
            <Testimonials />
            <Partners />
            <BlogLatest />

        </>
    )
}

export default HomePage;
