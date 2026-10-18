import React from "react";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import StatsStrip from "../components/home/StatsStrip";
import CallToAction from "../components/home/CallToAction";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <Features />
      <StatsStrip />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
