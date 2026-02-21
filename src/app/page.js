// app/page.jsx
import Header from './components/Header';
import Hero from './components/Hero';
import Team from './components/Team';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import FeaturedProperties from './components/FeaturedProperties';
import Loader from './components/Loader'; 

export default function Home() {
  return (
    <Loader>
      <main className="min-h-screen">
        <Header />
        <Hero />
        <Team />
        <Services />
        <FeaturedProperties />
        <Testimonials />
        <Contact />
        <Footer />
      </main>
    </Loader>
  );
}