// components/Hero.jsx
'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function Hero() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const heroSlides = [
    { 
      title: "Premium Commercial Spaces", 
      subtitle: "Warehouses • Showrooms • Offices",
      image: "/d11.webp",
      cta: "Explore Commercial Properties"
    },
    { 
      title: "Luxury Residential Properties", 
      subtitle: "Villas • Apartments • Townhouses",
      image: "/d2.jpg",
      cta: "View Residential Listings"
    },
    { 
      title: "Expert Property Management", 
      subtitle: "Relax While We Handle Everything",
      image: "/d3.webp",
      cta: "Learn About Our Services"
    },
  ];

  useEffect(() => {
    // Preload images
    const preloadImages = () => {
      heroSlides.forEach(slide => {
        const img = new Image();
        img.src = slide.image;
      });
    };
    preloadImages();
    
    // Set loaded state after a short delay
    const timer = setTimeout(() => setIsLoaded(true), 100);
    
    // Auto slide
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const nextSlide = () => {
    setCurrentImage((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentImage((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImage === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } ${isLoaded ? 'scale-100' : 'scale-110'}`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)), url('${slide.image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'transform 1s ease-out, opacity 1s ease-out',
            }}
          />
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Text Content */}
          <div className="text-center text-white mb-12">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Three Diamonds Real Estate
              </span>
              <div className="w-20 h-0.5 bg-white/50 mx-auto mt-2"></div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <span className="block text-white">DISCOVER DUBAI'S FINEST</span>
              <span className="block text-white mt-2">PROPERTIES</span>
            </h1>
            
            <div className="h-24 md:h-20 mb-8">
              <div className={`transition-all duration-500 transform ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
                  {heroSlides[currentImage].subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-wrap gap-4 justify-center transition-all duration-700 delay-300 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <a
              href="#properties"
              className="group bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 shadow-2xl"
            >
              <span>{heroSlides[currentImage].cta}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="#contact"
              className="group border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-black transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>

          {/* Featured Stats */}
          <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-500 ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {[
              { value: '15+', label: 'Years Experience' },
              { value: '500+', label: 'Properties' },
              { value: '100%', label: 'Client Satisfaction' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-4 backdrop-blur-sm bg-white/5 rounded-lg border border-white/10">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-300 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="w-10 h-10 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`transition-all duration-300 ${
                currentImage === index 
                  ? 'w-10 bg-white' 
                  : 'w-3 bg-white/50 hover:bg-white/80'
              } h-1 rounded-full`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="w-10 h-10 rounded-full border border-white/30 bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 group"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Scroll Indicator */}
      {/* <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <div className="text-center">
          <div className="text-xs text-white/60 mb-2">Scroll Down</div>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center mx-auto">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div> */}

      {/* Diamond Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-white/10 rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white/10 rotate-45"></div>
        <div className="absolute top-1/3 left-10 w-16 h-16 border-2 border-white/10 rotate-45"></div>
      </div>
    </section>
  );
}
