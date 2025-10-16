import { Helmet } from "react-helmet-async";
import React from "react";

const HelmetComponent = () => {
  return (
    <Helmet>
      <title>Abytech Hub</title>
      <meta name="description" content="Welcome to Abytech Hub, a leading web development and technology solutions provider specializing in React, JavaScript, and modern frameworks." />
      <meta name="keywords" content="Abytech Hub, web development, React, JavaScript, Vue.js, database, frontend, developer portfolio, technology solutions" />

      {/* Open Graph (OG) Meta Tags */}
      <meta property="og:title" content="Abytech Hub - Technology Solutions" />
      <meta property="og:description" content="Explore innovative projects and services at Abytech Hub, your go-to tech partner for web development and digital solutions." />
      <meta property="og:image" content="./abyteh_hub_logo.png" />
      <meta property="og:url" content="https://abytehhub.com" />
      <meta property="og:type" content="website" />

      {/* Twitter Meta Tags */}
      <meta name="twitter:title" content="Abytech Hub" />
      <meta name="twitter:description" content="Discover Abytech Hub, where innovation meets technology. Explore our services in web and software development." />
      <meta name="twitter:image" content="./abyteh_hub_logo.png" />
      <meta name="twitter:card" content="summary_large_image" />

      <link rel="icon" href="./abyteh_hub_logo.png" />
    </Helmet>
  );
};

export default HelmetComponent;
