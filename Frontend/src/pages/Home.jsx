import React from 'react'
import Hero from '../components/Hero'
import LesionSlider from '../components/LesionSlider'
import Footer from '../components/Footer'
import HowItWorks from '../components/HowItWorks'

const Home = () => {
  return (
    <div>
      <Hero/>
      <LesionSlider/>
      <HowItWorks/>
      <Footer/>
    </div>
  )
}

export default Home