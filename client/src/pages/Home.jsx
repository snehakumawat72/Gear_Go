import React from 'react'
import Hero from '../components/Hero'
import FeaturedSection from '../components/FeaturedSection'
import Banner from '../components/Banner'
import Testimonial from '../components/Testimonial'
import Newsletter from '../components/Newsletter'
import Services from '../components/Services'

const Home = () => {
  return (
    <div className='mt-[-80px]'>
      <Hero />
      <Services />
      <FeaturedSection />
      <Banner />
      <Testimonial />
      <Newsletter />
    </div>
    
  )
}

export default Home
