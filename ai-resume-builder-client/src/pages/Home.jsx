import React from 'react'
// import Banner from '../components/home/banner'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import Testimonial from '../components/home/Testimonial'
import Footer from '../components/home/Footer'
// import CTA from '../components/home/CallToAction'
import CallToAction from '../components/home/CallToAction'

const Home = () => {
  return (
    <div>
       {/* <Banner /> */}
       <Hero />
       <Features />
       <Testimonial />
       <CallToAction />
       <Footer />
    </div>
  )
}

export default Home