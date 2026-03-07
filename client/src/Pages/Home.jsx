import React from 'react'
import Hero from '../Components/Hero'
import About from '../Components/About'
import Services from '../Components/Services'
import Trainers from '../Components/Trainers'
import Plans from '../Components/Plans'
import Testimonials from '../Components/Testimonials'
import Gallery from '../Components/Gallery'
import Contact from '../Components/Contact'

const Home = () => {
  return (
    <div>
      <Hero />
      <About />
      <Services />
      <Trainers />
      <Plans />
      <Testimonials />
      <Gallery />
      <Contact />
    </div>
  )
}

export default Home
