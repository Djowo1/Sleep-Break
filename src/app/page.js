'use client'

import CustomCursor from '../components/CustomCursor/CustomCursor'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'
import Navbar from '../components/Navbar/Navbar'
import Hero from '../components/Hero/Hero'
import About from '../components/About/About'

export default function Home() {
  return (
    <>
      <CustomCursor />
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <About />
        <div id="gallery" style={{ height: '100vh' }} />
        <div id="enemies" style={{ height: '100vh' }} />
        <div id="devlog" style={{ height: '100vh' }} />
        <div id="community" style={{ height: '100vh' }} />
        <div id="demo" style={{ height: '100vh' }} />
      </main>
    </>
  )
}