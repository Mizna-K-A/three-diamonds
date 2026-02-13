// app/page.jsx
import Header from './components/Header'
import Hero from './components/Hero'
import Team from './components/Team'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Properties from './components/Properties'
import Contact from './components/Contact'
import Footer from './components/Footer'
import About from './components/About'
import Testimonials from './components/Testimonials'
import FeaturedProperties from './components/FeaturedProperties'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Team />
      <Services />
      <FeaturedProperties/>
      <Portfolio />
      <Properties />
      <Testimonials/>
      <Contact />
      <Footer />
    </main>
  )
}